const houseHandle = require('../DbHandler/HouseHandler')
const jwt = require('jsonwebtoken');
const removeFromSpaces = require('../Services/s3Services')
const newHouse = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Assumes Bearer token
        if (!token) {
            return res.status(401).json({ message: 'Access token is missing or invalid' });
        }

        // Verify the token and get user information
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure to set your secret in .env
        const userId = decoded.id;
        //get user_id from jwt token
        const { house_name,
            total_units,
            units_available,
            category,
            description,
            location,
            town,
            charges,
            county,
            location_pin,
        } = req.body

        if (!house_name || total_units === undefined || units_available === undefined || !category || !location || !town || !county || !location_pin) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const images = req.files;
        if (!images || images.length === 0) {
            return res.status(400).json({ message: 'at least one Product image is required' });
        }

        const imageUrls = [];
        for (const file of images) {
            const { location } = file;
            imageUrls.push(location);
        }
        const houseData = {
            house_name,
            user_id: userId, // Use userId extracted from the token
            total_units,
            units_available,
            category,
            description,
            location,
            town,
            charges,
            county,
            location_pin,
            images: JSON.stringify(imageUrls)
        };

        const response = await houseHandle.addHouse(houseData);
        console.log(response)
        return res.status(201).json(response)

    } catch (error) {
        console.error('Error adding house:', error);
        return res.status(500).json(error)
    }
}

//get all houses
const getAllHouses = async (req, res) => {
    try {
        const response = await houseHandle.getAllHouses()
        if (response.houses.length > 0 && response.success) {
           // console.log(response.houses)
            return res.status(200).json(response.houses)
        }
        return res.status(200).json([])
    } catch (error) {
        console.error('Error adding house:', error);
        return res.status(500).json(error)
    }
}

const getUserHouses = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Assumes Bearer token
        if (!token) {
            return res.status(401).json({ message: 'Access token is missing or invalid' });
        }

        // Verify the token and get user information
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure to set your secret in .env
        const userId = decoded.id;
        const response = await houseHandle.getHousesByUserId(userId)
        if (response.houses.length > 0 && response.success) {
            // console.log(response.houses)
            return res.status(200).json(response.houses)
        }
        return res.status(200).json([])

    } catch (error) {
        console.error('Error getting house:', error);
        return res.status(500).json(error)
    }
}
const getASingle = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await houseHandle.getHouseById(id);
        //console.log(response)
        if (response.houses.length > 0 && response.success) {
            console.log(response.houses)
            return res.status(200).json(response.houses)
        }
        return res.status(200).json([])
    } catch (error) {
        console.error('Error getting house:', error);
        return res.status(500).json(error.message)
    }
}

//update house 
const updateHouse = async (req, res) => {
    try {
        // Extract token from authorization header and verify it
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access token is missing or invalid' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Extract house update data from request body
        const {
            house_name,
            total_units,
            units_available,
            category,
            description,
            location,
            town,
            charges,
            county,
            location_pin
        } = req.body;

        // Get house_id from request params
        const { id: house_id } = req.params;
        const newImages = req.files; // New images uploaded with the request

        // Fetch the existing house details
        const house = await houseHandle.getHouseById(house_id);
        // console.log(house)
        // Check if the house exists
        if (!house || house.length === 0) {
            return res.status(404).json({ message: 'House not found' });
        }

        // Existing images from the database
        const oldImages = JSON.parse(house.houses[0].images);

        let imageUrls;

        // If new images are provided, delete old images and set new ones
        if (newImages && newImages.length > 0) {
            // Delete old images from storage
            if (oldImages && oldImages.length > 0) {
                for (const imageUrl of oldImages) {
                    const key = imageUrl.split('/').pop();
                    try {
                        const response = await removeFromSpaces(key);
                        console.log(`Old image ${key} deleted from storage`, response);
                    } catch (error) {
                        console.error(`Error deleting old image ${key}:`, error);
                        return res.status(500).json({ message: 'Error deleting old images', error });
                    }
                }

            }

            // Add new image URLs
            imageUrls = newImages.map(file => file.location);
        } else {
            // If no new images are provided, retain the existing images
            imageUrls = oldImages; // Keep the old images
        }

        // Build the updated house data object
        const updatedHouseData = {
            house_name,
            user_id: userId,
            total_units,
            units_available,
            category,
            description,
            location,
            town,
            charges,
            county,
            location_pin,
            images: JSON.stringify(imageUrls), // Convert to JSON string
            house_id
        };

        // Call the handler to update the house in the database
        const response = await houseHandle.updateHouse(updatedHouseData);

        if (response.success) {
            return res.status(200).json({
                success: true,
                message: 'House updated successfully',
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Failed to update house'
            });
        }
    } catch (error) {
        console.error('Error updating house:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

//delete house
const deleteHouse = async (req, res) => {
    console.log('..deleting')

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "product id is required!!" })
    }
    try {
        const response = await houseHandle.getHouseById(id);
        //delete imeges from digital ocean
        if (response.houses[0].product_images) {
            const images = JSON.parse(response.houses[0].product_images);
            for (const imageUrl of images) {
                const key = imageUrl.split('/').pop();
                try {
                    const response = await removeFromSpaces(key)
                    console.log(`old profile picture ${key} deleted from Digital Ocean`, response);
                } catch (error) {
                    console.error(`Error deleting old profile picture ${key}:`, err);
                    return res.status(500).json({ message: 'Error deleting old profile pictures', error });
                }
            }
        }
        await houseHandle.deleteHouse(id, userId);
        return res.status(200).json({ message: "house was deleted" });
    } catch (error) {
        console.error('Error updating house:', error);
        return res.status(500).json({ success: false, message: error.message });
    }


}
module.exports = {
    newHouse,
    getAllHouses,
    getUserHouses,
    getASingle,
    updateHouse,
    deleteHouse
}