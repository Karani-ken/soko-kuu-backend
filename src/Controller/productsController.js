const dbHandler = require('../DbHandler/DbHandler')
const jwt = require('jsonwebtoken');
const removeFromSpaces = require('../Services/s3Services')
const secretKey = process.env.JWT_SECRET;
//create products
const createProduct = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }
    const decodedToken = jwt.verify(token, secretKey);
    // console.log(decodedToken)
    const user_id = decodedToken?.id;

    if (!user_id) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    const { product_name, product_price,quantity, product_description, category, color, size } = req.body;
    try {
        if (!product_name || !product_description) {
            return res.status(400).json({ message: "All field are required" })
        }
        const product_images = req.files;
        if (!product_images || product_images.length === 0) {
            return res.status(400).json({ message: 'at least one Product image is required' });
        }
        const user = await dbHandler.getOneUser(user_id)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        //const subscription_plan = user[0].subscription;
       
        
        const imageUrls = [];
        for (const file of product_images) {
            const { location } = file;
            imageUrls.push(location);
        }
        //  console.log(imageUrl);  
        const formattedPrice = parseFloat(product_price).toFixed(2);

        const productData = {
            product_name,
            product_price: formattedPrice,
            quantity,
            product_description,
            product_images: JSON.stringify(imageUrls),
            category,
            color,
            size,
            user_id: user_id
        }
        // console.log(productData)
        await dbHandler.insertProduct(productData);
        return res.status(200).json({ message: "Product was added successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creating product', error });
    }
}
//const update quantity
const updateProductQuantity = async ( req, res) => {
    const {quantity, product_id} = req.body;

    try {
        await dbHandler.updateProductQuantity(quantity, product_id)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error updating quantity', error });
    }
}

//get all products
const getProducts = async (req, res) => {
    try {
        //fethc all the products
        const products = await dbHandler.getAllProducts();

        //iterate over each product and append the user's phone number as user_contact
        const newProducts = await Promise.all(
            products.map(async (product) => {
                // fetch user by user_id
                const user = await dbHandler.getOneUser(product.user_id);

                // console.log(user[0].phone)
                return {
                    ...product,
                    user_contact: user && user[0] ? user[0].phone : null,
                    ...user[0]
                };
            })
        );
        //  console.log(newProducts)
        return res.status(200).json(newProducts)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error getting product', error });
    }
}


//get all products for a business
const getAllProducts = async (req, res) => {
    const { user_id } = req.params
    try {
        if (!user_id) {
            return res.status(400).json({ message: "user id is required!!" })
        }
        const products = await dbHandler.getBusinessProducts(user_id);
        const newProducts = await Promise.all(
            products.map(async (product) => {
                const user = await dbHandler.getOneUser(user_id);

                return {
                    ...product,
                    user_contact: user && user[0] ? user[0].phone : null,
                };
            })
        )
        return res.status(200).json(newProducts);
    } catch (error) {
        return res.status(500).json({ message: "Error getting products!!", error })
    }
}
//get a single product
const getAProduct = async (req, res) => {

    try {
        const { product_id } = req.params;
        if (!product_id) {
            return res.status(400).json({ message: "product id is required" });
        }

        const product = await dbHandler.getOneProduct(product_id);
        if (!product || product.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        const user = await dbHandler.getOneUser(product[0].user_id)

        const newProduct = {
            ...product[0],
            user_contact: user && user[0] ? user[0].phone : null,
        }

        return res.status(201).json(newProduct)

    } catch (error) {
        res.status(500).json({ message: 'Error getting the product', error });
    }
}
//update products
const updateAProduct = async (req, res) => {
    const { product_name, product_price, quantity, product_description, category, color, size } = req.body;
    const { product_id } = req.params; // Fetching the product_id from URL params

    // Validate the required fields
    if (!product_id || !product_name || !product_description) {
        return res.status(400).json({ message: "All fields are required!!" });
    }
    try {
        // Prepare the update data object
        const updateProductData = { product_id, product_name, product_price, quantity, product_description, category, color, size };

       // console.log(updateProductData)
        // Update the product in the database
        await dbHandler.updateProduct(updateProductData);

        return res.status(200).json({ message: "Product was updated successfully" });
    } catch (error) {
        console.log
        return res.status(500).json({ message: 'Error updating product', error });
    }
};

const updateProductImages = async (req, res) => {
    const { product_id } = req.params;
    const product_images = req.files;
    if (!product_images || product_images.length === 0) {
        return res.status(400).json({ message: 'at least one Product image is required' });
    }
    try {
        const product = await dbHandler.getOneProduct(product_id);
        if (!product) {
            return res.status(404).json({ message: "product not found!!" })
        }

        //delete old images if the product has existing public ids

        if (product[0].product_images) {
            const images = JSON.parse(product[0].product_images);
            for (const imageUrl of images) {
                const key = imageUrl.split('/').pop();
                try {
                    const response = await removeFromSpaces(key)
                  //  console.log(`old profile picture ${key} deleted from Cloudinary`, response);
                } catch (error) {
                    console.error(`Error deleting old profile picture ${key}:`, err);
                    return res.status(500).json({ message: 'Error deleting old profile pictures', error });
                }
            }
        }

        //upload the new Profile pictures to Cloudinary
        const newImageUrls = []

        for (const file of product_images) {
            const { location } = file;
            newImageUrls.push(location)
        }


        // Create the updated product images object with correct JSON.stringify usage
        const updatedProductImages = {
            product_id,
            product_images: JSON.stringify(newImageUrls),  // Correct usage of JSON.stringify              
        };

        await dbHandler.updateProductImages(updatedProductImages)
        return res.status(200).json({ message: 'Product images updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating product images', error });
    }
}



//delete product
const deleteProduct = async (req, res) => {
    const { product_id } = req.params;
    if (!product_id) {
        return res.status(400).json({ message: "product id is required!!" })
    }
    try {
        const product = await dbHandler.getOneProduct(product_id);
        //delete imeges from digital ocean
        if (product[0].product_images) {
            const images = JSON.parse(product[0].product_images);
            for (const imageUrl of images) {
                const key = imageUrl.split('/').pop();
                try {
                    const response = await removeFromSpaces(key)
                   // console.log(`old profile picture ${key} deleted from Cloudinary`, response);
                } catch (error) {
                    console.error(`Error deleting old profile picture ${key}:`, err);
                    return res.status(500).json({ message: 'Error deleting old profile pictures', error });
                }
            }
        }
        await dbHandler.deleteProduct(product_id);
        return res.status(200).json({ message: "product was deleted" });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
}
//get products by category
const getProductByCategory = async (req, res) => {
    const { category } = req.params
    try {
        const products = await dbHandler.getProductsByCategories(category)
        return res.status(200).json(products)
    } catch (error) {
        return res.status(500).json({ message: 'Error gettong products ', error });
    }
}
//get products on offer
const getProductByOnOffers = async (req, res) => {
    try {
        const products = await dbHandler.getProductsOnOffer()
        return res.status(200).json(products)
    } catch (error) {
        return res.status(500).json({ message: 'Error gettong products ', error });
    }
}
//get products for Gold Businessesses
const getExclusiveProducts = async (req, res) => {
    try {
        const users = await dbHandler.getGoldUsers();
        const products = await dbHandler.getAllProducts();

        //extract users ids of gold users
        const goldUserIds = users.map(user => user.id);

        const exclusiveProducts = products.filter(product => goldUserIds.includes(product.user_id))

        return res.status(200).json(exclusiveProducts);
    } catch (error) {
        console.error("Error fetching exclusive products:", error);
        res.status(500).json({ message: "Error fetching exclusive products" });
    }
}

module.exports = {
    createProduct,
    getAProduct,
    updateAProduct,
    deleteProduct,
    getAllProducts,
    getProducts,
    updateProductImages,
    getProductByCategory,
    getProductByOnOffers,
    getExclusiveProducts,
    updateProductQuantity
}


