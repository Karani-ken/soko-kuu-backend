const dbHandler = require('../DbHandler/DbHandler');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const removeFromSpaces = require('../Services/s3Services')

// Create Service
const createService = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }
    const decodedToken = jwt.verify(token, secretKey);
    const user_id = decodedToken?.id;

    if (!user_id) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    const { service_name, service_description, service_charges, service_category, offer } = req.body;
    try {
        if (!service_name || !service_description) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const service_images = req.files;
        if (!service_images || service_images.length === 0) {
            return res.status(400).json({ message: 'At least one service image is required' });
        }

        const imageUrls = [];

        for (const file of service_images) {
            const { location } = file;
            imageUrls.push(location);
        }
        const formattedPrice = parseFloat(service_charges).toFixed(2);
        const serviceData = {
            service_name,
            service_description,
            service_charges: formattedPrice,
            service_images: JSON.stringify(imageUrls),
            service_category,
            offer,
            user_id
        };

        await dbHandler.insertService(serviceData);
        return res.status(200).json({ message: "Service was added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating service', error });
    }
};

// Get one service by ID
const getAService = async (req, res) => {
    const { service_id } = req.params;
    try {
        if (!service_id) {
            return res.status(400).json({ message: "Service ID is required" });
        }

        const service = await dbHandler.getOneService(service_id);
        if (!service || service.length === 0) {
            return res.status(404).json({ message: "Service not found" });
        }
        const user = await dbHandler.getOneUser(service[0].user_id);

        const newService = {
            ...service[0],
            user_contact: user && user[0] ? user[0].phone : null,
        };
        // console.log(newService)

        return res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ message: 'Error getting the service', error });
    }
};

// Get all services for a user (business)
const getUserServices = async (req, res) => {
    const { user_id } = req.params;
    try {
        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        console.log(user_id)
        const services = await dbHandler.getUserServices(user_id);
        console.log(services)
        const newServices = await Promise.all(
            services.map(async (service) => {
                const user = await dbHandler.getOneUser(user_id);
                return {
                    ...service,
                    user_contact: user && user[0] ? user[0].phone : null,
                };
            })
        );
        return res.status(200).json(newServices);
    } catch (error) {
        return res.status(500).json({ message: "Error getting services", error });
    }
};

// Get all services
const getAllServices = async (req, res) => {
    try {
        console.log("getting services...")
        const services = await dbHandler.getAllServices();
        console.log(services)
        const newServices = await Promise.all(
            services.map(async (service) => {
                const user = await dbHandler.getOneUser(service.user_id);
                return {
                    ...service,
                    user_contact: user && user[0] ? user[0].phone : null,
                };
            })
        );
        return res.status(200).json(newServices);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error getting services', error });
    }
};

// Update service details
const updateAService = async (req, res) => {
    const { service_name, service_description, service_charges, service_category, offer } = req.body;
    const { service_id } = req.params;

    if (!service_id || !service_name || !service_description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const updateServiceData = { service_id, service_name, service_description, service_charges, service_category, offer };
        await dbHandler.updateService(updateServiceData);
        return res.status(200).json({ message: "Service was updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error updating service', error });
    }
};

// Update service images
const updateServiceImages = async (req, res) => {
    const { service_id } = req.params;
    const service_images = req.files;
    if (!service_images || service_images.length === 0) {
        return res.status(400).json({ message: 'At least one service image is required' });
    }
    try {
        const service = await dbHandler.getOneService(service_id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Delete old images if the service has existing public ids
        if (service[0].service_images) {
            const images = JSON.parse(product[0].service_images);
            for (const imageUrl of images) {
                const key = imageUrl.split('/').pop();
                try {
                    const response = await removeFromSpaces(key)
                    console.log(`old profile picture ${key} deleted from Cloudinary`, response);
                } catch (error) {
                    console.error(`Error deleting old profile picture ${key}:`, err);
                    return res.status(500).json({ message: 'Error deleting old profile pictures', error });
                }
            }
        }

        // Upload new service images
        const newImageUrls = [];


        for (const file of product_images) {
            const { location } = file;
            newImageUrls.push(location)
        }


        const updatedServiceImages = {
            service_id,
            service_images: JSON.stringify(newImageUrls),
        };

        await dbHandler.updateServiceImages(updatedServiceImages);
        return res.status(200).json({ message: 'Service images updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating service images', error });
    }
};

// Delete service
const deleteService = async (req, res) => {
    const { service_id } = req.params;
    if (!service_id) {
        return res.status(400).json({ message: "Service ID is required" });
    }
    try {
        const service = await dbHandler.getOneService(service_id);

        //delete service images from digital ocean
        if (service[0].service_images) {
            const images = JSON.parse(service[0].service_images);
            for (const imageUrl of images) {
                const key = imageUrl.split('/').pop();
                try {
                    const response = await removeFromSpaces(key)
                    console.log(`old profile picture ${key} deleted from Cloudinary`, response);
                } catch (error) {
                    console.error(`Error deleting old profile picture ${key}:`, err);
                    return res.status(500).json({ message: 'Error deleting old profile pictures', error });
                }
            }
        }
        await dbHandler.deleteService(service_id);
        return res.status(200).json({ message: "Service was deleted" });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting service', error });
    }
};
const getServiceByCategory = async (req, res) => {
    const { category } = req.params
    try {
        const products = await dbHandler.getServicesByCategories(category)
        return res.status(200).json(products)
    } catch (error) {
        return res.status(500).json({ message: 'Error gettong products ', error });
    }
}
//get products on offer
const getServicesByOnOffers = async (req, res) => {
    try {
        const products = await dbHandler.getServicesOnOffer()
        return res.status(200).json(products)
    } catch (error) {
        return res.status(500).json({ message: 'Error gettong products ', error });
    }
}
//get products for Gold Businessesses
const getExclusiveServices = async (req, res) => {
    try {
        const users = await dbHandler.getGoldUsers();
        const services = await dbHandler.getAllServices();

        //extract users ids of gold users
        const goldUserIds = users.map(user => user.id);

        const exclusiveServices = services.filter(service => goldUserIds.includes(service.user_id))

        return res.status(200).json(exclusiveServices);
    } catch (error) {
        console.error("Error fetching exclusive services:", error);
        res.status(500).json({ message: "Error fetching exclusive services" });
    }
}
// Export modules
module.exports = {
    createService,
    getAService,
    getAllServices,
    getUserServices,
    updateAService,
    updateServiceImages,
    deleteService,
    getExclusiveServices,
    getServiceByCategory,
    getServicesByOnOffers
};
