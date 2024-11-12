const mysql = require('mysql2')
const dbConfig = require('../Config/dbConfig')
const userQueries = require("../Queries/UserQueries")
const productQueries = require('../Queries/productQueries')
const categoriesQueries = require('../Queries/CategoriesQueries')
const visitortracker = require('../Queries/visitorTracker')
const paymentQueries = require('../Queries/PaymentQueries')
const serviceQueries = require('../Queries/ServiceQueries')
const cartQueries = require('../Queries/CartQueries')
const customerQuery = require('../Queries/CustomersQueries')
const orderQueries = require('../Queries/Orders')
const otpQuery = require('../Queries/OtpQueries')
const locations = require('../Queries/LocationQueries')
const feedback = require('../Queries/Feedback')
const houseQueries = require('../Queries/House')
const pool = mysql.createPool(dbConfig); /* connection pool is technique 
used to efficiently manage and reuse database connections improving performance */

const executeQuery = (query, values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, values, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

const createDatabaseIfNotExists = async () => {
    try {
        const result = await executeQuery(userQueries.showDatabases);
        const DatabaseExists = result.length > 0;
        if (!DatabaseExists) {
            await executeQuery(userQueries.createDatabase);
            console.log('database created successfully')
        } else {
            console.log('Database already exists');
        }
    } catch (error) {
        console.error(error)
    }
}

const createTableIfNotExists = async () => {
    const tables = [
        { name: 'users', query: userQueries.showUsersTable, createQuery: userQueries.usersTable },
        { name: 'products', query: productQueries.showProductTable, createQuery: productQueries.productsTable },
        { name: 'categories', query: categoriesQueries.showCategoriesTable, createQuery: categoriesQueries.categoryTable },
        { name: 'product_categories', query: categoriesQueries.showProductCategoriesTable, createQuery: categoriesQueries.productCategoryTable },
        { name: 'service_categories', query: categoriesQueries.showServiceCategoriesTable, createQuery: categoriesQueries.serviceCategoryTable },      
        { name: 'services', query: serviceQueries.showServiceTable, createQuery: serviceQueries.createServiceTable },
        { name: 'payments', query: paymentQueries.showPaymentsTable, createQuery: paymentQueries.createPaymentsTable },
        { name: 'cart', query: cartQueries.showCartTable, createQuery: cartQueries.createCart },
        { name: 'cart_items', query: cartQueries.showCartItemsTable, createQuery: cartQueries.createCartItemsTable },
        { name: 'orders', query: orderQueries.showOrdersTable, createQuery: orderQueries.createOrdersTable },
        { name: 'orders_items', query: orderQueries.showOrderItemsTable, createQuery: orderQueries.createOrderItemsTable },
        { name: 'customers', query: customerQuery.showCustomersTable, createQuery: customerQuery.createCustomerTable },
        { name: 'otp', query: otpQuery.showOtpTable, createQuery: otpQuery.createOtpTable},
        { name: 'locations', query: locations.showLocationTable, createQuery: locations.createLocationsTable},
        { name: 'feedback', query: feedback.showFeedbackTable, createQuery: feedback.createFeedbackTable},
        { name: 'houses', query: houseQueries.showHouseTable, createQuery: houseQueries.createHouseTable }
    ];
    try {
        for (const table of tables) {
            const tableInfo = await executeQuery(table.query);
            if (tableInfo.length === 0) {
                await executeQuery(table.createQuery);
                console.log(`${table.name} table was created successfully`);
            } else {
                console.log(`${table.name} table already exists`);
            }
        }
    } catch (error) {
        console.error(error)
    }
}

//USERS
//insert user
const insertUser = async (userData) => {
    const { name, email, password, phone, location, category, profile_pic, type, description, address, city, county, agent_id } = userData;

    try {
        await executeQuery(userQueries.createUser, [name, email, password, phone, location, category, profile_pic, type, description, address, city, county, agent_id]);
       // console.log('User added successfully');
        return "success"
    } catch (error) {
        console.log('Error inserting user:', error);
        throw error;
    }
}

//add agent

const addAgent = async (userData) => {
    const { name, email, password, phone, county, city, role } = userData
    try {
        await executeQuery(userQueries.insertAgent, [name, email, password, phone, county, city, role])
       // console.log('Agent added successfully');
        return "success"
    } catch (error) {
        console.log('Error inserting Agent:', error);
        throw error;
    }
}




//update user password
const updateUserPassword = async (password, email) => {
    try {
        await executeQuery(userQueries.updateUserPassword, [password, email]);
       // console.log("Password was updated successfully");
    } catch (error) {
        console.log(error)
    }
}
// find user by email
const findUserByEmail = async (email) => {
    try {
        const user = await executeQuery(userQueries.findUserByEmail, [email]);
        return user;
    } catch (error) {
        console.log(error)
    }
}
//update user account
const updateUser = async (userData) => {
    try {
        const { id, name, phone, location, category, description, type, address, city, county } = userData;
        // Ensure all fields are passed, and email is used as a unique identifier for the update.
        await executeQuery(userQueries.updateUser, [name, phone, location, category, description, type, address, city, county, id]);
        //console.log('User updated successfully');
        return "success"
    } catch (error) {
        console.log('Error updating user:', error);
        throw error;
    }
}
//update userProfile
const updateUserProfile = async (updatedProfile) => {
    const { id, profile_pic, public_id } = updatedProfile
    try {
        await executeQuery(userQueries.updateUserProfilePic, [profile_pic, public_id, id]);
       // console.log("Profile pic updated successfully")
        return "success"
    } catch (error) {
        throw error;
    }
}
//find user by Id
const getOneUser = async (id) => {
    try {
        const user = await executeQuery(userQueries.findUserById, [id]);
        // console.log(user)
        return user;
    } catch (error) {
        throw error;
    }
}
const getAllUsers = async () => {
    try {
        const users = await executeQuery(userQueries.getUsers);
        return users;
    } catch (error) {
        throw error;
    }
}
//get all agents
const getAllAgents = async () => {
    try {
        const users = await executeQuery(userQueries.getAgents);
        return users;
    } catch (error) {
        throw error;
    }
}
//delete a user
const deleteUser = async (id) => {
    try {
        await executeQuery(userQueries.deleteUser, [id]);
        return "success";
    } catch (error) {
        console.log("error deleting user", error);
        throw error;
    }
}

//update user subscription
const updateUserPlan = async (id, subscription) => {
    try {
        await executeQuery(userQueries.updatePlan, [subscription, id])
       // console.log("Updated status")
    } catch (error) {
        throw error;
    }
}

//get agent users
const getUsersByAgentId = async (agent_id) => {
    try {
        const users = await executeQuery(userQueries.getUsersByAgentId, [agent_id]);
        return users;
    } catch (error) {
        throw error;
    }
}



//insert product
const insertProduct = async (productData) => {
    const { product_name, user_id, product_price, quantity, product_description, product_images, category, color, size } = productData;
    try {
        await executeQuery(productQueries.insertProduct, [product_name, product_description, product_price, quantity, product_images, category,color, size, user_id]);
        //console.log("Product was added")
    } catch (error) {
        throw error;
    }
}
const updateProductQuantity = async (quantity, product_id) => {
    try {
        await executeQuery(productQueries.updateQuantity, [quantity, product_id])
       // console.log("Quantity was updated")
    } catch (error) {
        throw error;
    }
}

const getGoldUsers = async () => {
    try {
        const users = await executeQuery(userQueries.getGoldUsers)
        return users;
    } catch (error) {
        throw error;
    }
}
//get all products
const getAllProducts = async () => {
    try {
        const products = await executeQuery(productQueries.getProducts);
        return products;
    } catch (error) {
        throw error;
    }
}

//get a single product
const getOneProduct = async (product_id) => {
    try {
        const product = await executeQuery(productQueries.getProduct, [product_id])
        return product;
    } catch (error) {
        throw error;
    }
}
//get business products
const getBusinessProducts = async (user_id) => {
    try {
        const products = await executeQuery(productQueries.getBusinessProducts, [user_id]);
        return products;
    } catch (error) {
        throw error;
    }
}
const getProductsByCategories = async (category) => {
    try {
        const products = await executeQuery(productQueries.getProductsByCategory, [category])
        return products;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
const getProductsOnOffer = async () => {
    try {
        const products = await executeQuery(productQueries.getProductsOnOffer)
        return products;
    } catch (error) {
        console.log(error);
        throw error;
    }
}




//update products
const updateProduct = async (updateProductData) => {
    const { product_name, product_price, quantity, product_description, product_id, category, color, size } = updateProductData;
    try {
        await executeQuery(productQueries.updateProducts, [product_name, product_price, quantity, product_description, category, color, size, product_id]);
       // console.log("product was updated")
        return "Product was updated";
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const updateProductImages = async (updatedProductImageData) => {
    const { product_images, product_id } = updatedProductImageData;
    try {
        const response = await executeQuery(productQueries.updateProductImages, [product_images, product_id]);
        //console.log("product Images were updated", response)
        return "Product images were updated";
    } catch (error) {
        console.log(error)
        throw error;
    }
}

//set Discount 
const setProductDiscount = async (product_id, discount) => {
    try {
        await executeQuery(productQueries.setDiscount, [product_id, discount]);
        return "return discount set successfully";
    } catch (error) {
        throw error;
    }

}

//delete product
const deleteProduct = async (product_id) => {
    try {
        await executeQuery(productQueries.deleteProduct, [product_id]);
        return "deleted product successfully";
    } catch (error) {
        throw error;
    }
}
//delete product with user_id
const deleteUserProducts = async (user_id) => {
    try {
        await executeQuery(productQueries.deleteProductWithUserId, [user_id])
        return "all user products have been deleted"
    } catch (error) {
        throw error;
    }
}

//CATEGORIES 
const createCategories = async (category_name, banner) => {
    try {

        await executeQuery(categoriesQueries.insertCategory, [category_name, banner]);
        return "success";
    } catch (error) {
        console.log(error);
        return error;
    }
}

const getCategories = async () => {
    try {
        const categories = await executeQuery(categoriesQueries.getCategories);
        return categories;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
const deleteCategory = async (category_id) => {
    try {
        await executeQuery(categoriesQueries.deleteCategory, [category_id]);
        //console.log("deleted product successfully")
    } catch (error) {
        throw error;
    }
}

//PRODUCT CATEGORIES
const createProductCategories = async (category_name, category_description, banner) => {
    try {

        await executeQuery(categoriesQueries.insertProductCategory, [category_name, category_description, banner]);
        return "success";
    } catch (error) {
        console.log(error);
        return error;
    }
}
const getProductCategories = async () => {
    try {
        const categories = await executeQuery(categoriesQueries.getProductCategories);
        return categories;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
const deleteProductCategory = async (category_id) => {
    try {
        await executeQuery(categoriesQueries.deleteProductCategory, [category_id]);
        //console.log("deleted product successfully")
    } catch (error) {
        throw error;
    }
}

const createServiceCategories = async (category_name, category_description, banner) => {
    try {

        await executeQuery(categoriesQueries.insertServiceCategory, [category_name, category_description, banner]);
        return "success";
    } catch (error) {
        console.log(error);
        return error;
    }
}
const getServiceCategories = async () => {
    try {
        const categories = await executeQuery(categoriesQueries.getServiceCategories);
        return categories;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
const deleteServiceCategory = async (category_id) => {
    try {
        await executeQuery(categoriesQueries.deleteServiceCategory, [category_id]);
       // console.log("deleted product successfully")
    } catch (error) {
        throw error;
    }
}
// Insert payment
const insertPayment = async (paymentData) => {
    const { transaction_code, name, email, phone, agent_id } = paymentData;
    try {
        await executeQuery(paymentQueries.insertPayment, [transaction_code, name, email, phone, agent_id]);
        //console.log("Payment was added");
        return "Payment was added";
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Get all payments
const getAllPayments = async () => {
    try {
        const payments = await executeQuery(paymentQueries.selectAllPayments);
        return payments;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Get a single payment by payment_id
const getOnePayment = async (payment_id) => {
    try {
        const payment = await executeQuery(paymentQueries.selectPaymentById, [payment_id]);
        return payment;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Get a single payment by transaction_code
const getPaymentByTransactionCode = async (transaction_code) => {
    try {
        const payment = await executeQuery(paymentQueries.selectPaymentByTransactionCode, [transaction_code]);
        return payment;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

//select agent payment 
const myPayments = async (agent_id) => {
    try {
        const payments = await executeQuery(paymentQueries.selectAgentPayments, [agent_id])
        return payments;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Update payment
const updatePayment = async (updatePaymentData) => {
    const { name, email, phone, agent_id, payment_id } = updatePaymentData;
    try {
        await executeQuery(paymentQueries.updatePayment, [name, email, phone, agent_id, payment_id]);
       // console.log("Payment was updated");
        return "Payment was updated";
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Delete payment
const deletePayment = async (payment_id) => {
    try {
        await executeQuery(paymentQueries.deletePayment, [payment_id]);
       // console.log("Payment was deleted");
        return "Payment was deleted";
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Insert service
const insertService = async (serviceData) => {
    console.log(serviceData)
    const { service_name, service_description, service_charges, user_id, offer, service_images, service_category } = serviceData;
    try {
        await executeQuery(serviceQueries.insertIntoTable, [service_name, service_description, service_charges, user_id, offer, service_images, service_category]);
       // console.log("Service was added");
        return "Service was added";
    } catch (error) {
        console.log("error adding service", error);
        throw error;
    }
};

// Get all services
const getAllServices = async () => {
    try {
        const services = await executeQuery(serviceQueries.selectAllServices);
        //console.log(services)
        return services;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Get a single service by service_id
const getOneService = async (service_id) => {
    try {
        const service = await executeQuery(serviceQueries.getOneService, [service_id]);
        // console.log(service)
        return service;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Get all services for a specific user (business)
const getUserServices = async (user_id) => {
    try {
        const services = await executeQuery(serviceQueries.getServicesOfferedByUsers, [user_id]);
       // console.log(services)
        return services;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
const getServicesByCategories = async (service_category) => {
    try {
        const services = await executeQuery(serviceQueries.getServicesByCategory, [service_category])
        return services;
    } catch (error) { 
        console.log(error);
        throw error;
    }
}
const getServicesOnOffer = async () => {
    try {
        const services = await executeQuery(serviceQueries.getServicesOnOffer)
        return services;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Update service
const updateService = async (updateServiceData) => {
    const { service_name, service_description, service_charges, offer, service_category, service_id } = updateServiceData;
    try {
        await executeQuery(serviceQueries.updateService, [service_name, service_description, service_charges, offer, service_category, service_id]);
        //console.log("Service was updated");
        return "Service was updated";
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Update service images
const updateServiceImages = async (updateServiceImagesData) => {
    const { service_images, service_id } = updateServiceImagesData;
    try {
        await executeQuery(serviceQueries.updateProductImages, [service_images, service_id]);
        //console.log("Service images were updated");
        return "Service images were updated";
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Delete service
const deleteService = async (service_id) => {
    try {
        await executeQuery(serviceQueries.deleteService, [service_id]);
       // console.log("Service was deleted");
        return "Service was deleted";
    } catch (error) {
        console.log(error);
        throw error;
    }
};

//Cart 

// Cart DB handler functions
const addCart = async (customer_id) => {
    try {
        return await executeQuery(cartQueries.insertCart, [customer_id]);
    } catch (error) {
        console.log(error)
        throw error;
    }
    
};

//get cart by id
const getcartById = async (cart_id) => {
    try {
        return executeQuery(cartQueries.getCartById, [cart_id])
    } catch (error) {
        console.log(error)
        throw error;
    }
}
const getCustomerCart = async (customer_id) => {
    try {
        return await executeQuery(cartQueries.getCustomerCart, [customer_id]);
    } catch (error) {
        console.log(error)
        throw error;
    }
   
};

const deleteCart = async (cart_id) => {
    try {
        return await executeQuery(cartQueries.deleteCart, [cart_id]);
    } catch (error) {
        console.log(error)
        throw error;
    }
   
};

// Cart Items DB handler functions
const addCartItem = async (product_id, cart_id, product_name, product_price, quantity) => {
    try {
        return await executeQuery(cartQueries.addCartItems, [product_id, cart_id, product_name, product_price, quantity]);
    } catch (error) {
        console.log(error)
        throw error;
    }
  
};

const getCartItems = async (cart_id) => {
    try {
        return await executeQuery(cartQueries.getCartItems, [cart_id]); 
    } catch (error) {
        console.log(error)
        throw error;
    }
  
};

const updateCartItem = async (cart_item_id, quantity) => {
    try {
       const result = await executeQuery(cartQueries.updateCartItems, [quantity, cart_item_id]);
       // console.log(result)
    } catch (error) {
        console.log(error)
        throw error;
    }
   
};

const deleteCartItemById = async (cart_item_id) => {
    try {
        return await executeQuery(cartQueries.deleteCartItemById, [cart_item_id]);
    } catch (error) {
        console.log(error)
        throw error;
    }
   
};

const deleteAllCartItems = async (cart_id) => {
    return await executeQuery(cartQueries.deleteAllCartItems, [cart_id]);
};
//Customers
const insertCustomer = async (customerData) => {
    const { customer_name, phone, email,password, googleId, town, county,  } = customerData;
    try {
         await executeQuery(customerQuery.insertCustomer, [customer_name, phone, email,password, googleId, town, county, ])
        return "success adding customer"
    } catch (err) {
        console.error('Error inserting customer:', err);
        throw err;
    }
}

const updateCustomer = async (customer_id, customerData) => {
    const { customer_name, phone, email, town, county, password } = customerData;
    try {
        const [result] = await executeQuery(customerQuery.updateCustomer, [customer_name, phone, email, town, county, password, customer_id]);
        return result;
    } catch (err) {      
        console.error('Error updating customer:', err);
        throw err;
    }
};

const getCustomerById = async (customer_id) => {
    try {
        const [rows] = await executeQuery(customerQuery.getCustomerById, [customer_id]);
        return rows; // Return the first row since it's only one customer
    } catch (err) {
        console.error('Error retrieving customer:', err);
        throw err;
    }
};
const getCustomerByEmail = async (email) => {
    try {
        const [rows] = await executeQuery(customerQuery.getCustomerByEmail, [email]);
        return rows; // Return the first row (customer)
    } catch (err) {
        console.error('Error retrieving customer by email:', err);
        throw err;
    }
};
const updateCustomerPassword = async (password, email) => {
    try {
        await executeQuery(customerQuery.updatePassword, [password, email]);
        //console.log("password updated successfully")
    } catch (err) {
        console.error('Error retrieving customer by email:', err);
        throw err;
    }
}

const deleteCustomer = async (customer_id) => {
    try {
        const [result] = await executeQuery(customerQuery.deleteCustomer, [customer_id]);
        return result;
    } catch (err) {
        console.error('Error deleting customer:', err);
        throw err;
    }
};

//orders

const addOrder = async (customer_id, payment_code,location, location_pin, total_price) => {
    try {
        return await executeQuery(orderQueries.addOrder, [customer_id, payment_code,location, location_pin, total_price]);
    } catch (err) {
        console.error('Error deleting customer:', err);
        throw err;
    }
   
};

const getAllOrders = async () => {
    try {
        return await executeQuery(orderQueries.getAllOrders)
    } catch (error) {
        console.error('Error deleting customer:', err);
        throw err;
    }
}

const getOrdersByCustomerId = async (customer_id) => {
    try {
        return await executeQuery(orderQueries.getOrdersByCustomerId, [customer_id]);
    } catch (err) {
        console.error('Error deleting customer:', err);
        throw err;
    }
   
};

const getOrdersByOrderId = async (order_id) => {
    try {
        return await executeQuery(orderQueries.getOrdersById, [order_id]);
    } catch (err) {
        console.error('Error deleting customer:', err);
        throw err;
    }
   
};

const updateOrderStatus = async (order_id, order_status) => {
    try {
        return await executeQuery(orderQueries.updateOrderStatus, [order_status, order_id]);
    } catch (err) {
        console.error('Error deleting customer:', err);
        throw err;
    }
  
};

const deleteOrderById = async (order_id) => {
    try {
        return await executeQuery(orderQueries.deleteOrderById, [order_id]);
    } catch (err) {
        console.error('Error deleting customer:', err);
        throw err;
    }
   
};

// Order Items DB handler functions
const addOrderItems = async (order_id, product_id, product_name, product_price, quantity) => {
    try {
        return await executeQuery(orderQueries.addOrderItems, [order_id, product_id, product_name, product_price, quantity]);
    } catch (err) {
        console.error('Error deleting customer:', err);
        throw err;
    }
    
};

const getOrderItemsByOrderId = async (order_id) => {
    try {
        return await executeQuery(orderQueries.getOrderItemsByOrderId, [order_id]);
    } catch (err) {
        console.error('Error deleting customer:', err);
        throw err;
    }
    
};

const deleteOrderItemsByOrderId = async (order_id) => {
    return await executeQuery(orderQueries.deleteOrderItemsByOrderId, [order_id]);
};

//OTP
const insertOtp = async (email,code,expiresAt) => {
    try {
        await executeQuery(otpQuery.insertCode, [email,code,expiresAt])
        //console.log("code inserted successfully")
    } catch (err) {
        console.error('Error deleting customer:', err);
        throw err;
    }
}

const getOtp = async (email) => {
    try {
       const OTP = await executeQuery(otpQuery.findOtp, [email])
       return OTP
    } catch (err) {
        console.error('Error deleting customer:', err);
        throw err;
    }
}

const removeOtp = async (email) => {
    try {
        await executeQuery(otpQuery.deleteOtp, [email])
        //console.log('OTP deleted Successfully')
    } catch (err) {
        console.error('Error deleting customer:', err);
        throw err;
    }
}

const addLocation = async (location_name,charges) => {
    try {
        await executeQuery(locations.insertLocation,[location_name,charges])
       // console.log('added Successfully')
    } catch (err) {
        console.error('Error deleting customer:', err);
        throw err;
    }
}

const getLocationById = async (location_id) => {
    try {
       return await executeQuery(locations.getLocationById, [location_id])
    } catch (err) {
        console.error('Error deleting customer:', err);
        throw err;
    }
}

const updateLocation = async (location_id, location_name, charges) => {
    
    try {
        await executeQuery(locations.updateLocation, [location_name, charges, location_id]);
        //console.log('Location updated successfully');
    } catch (error) {
        console.error('Error updating location:', error);
        throw error;
    }
};

const deleteLocation = async (location_id) => {
    
    try {
        await executeQuery(locations.deleteLocation, [location_id]);
       // console.log('Location deleted successfully');
    } catch (error) {
        console.error('Error deleting location:', error);
        throw error;
    }
};

// Get all locations
const getAllLocations = async () => {
    
    try {
        const AllLocations = await executeQuery(locations.selectLocations);
       //console.log(AllLocations)
        return AllLocations;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
};

//feedback 
const createFeedback = async (product_id, user_id, rating, comment ) => {
    try {
        await executeQuery(feedback.createFeedback, [product_id, user_id, rating, comment])
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}

const getFeedbackByProduct = async (product_id) => {
    try {
        const  feedbacks = await executeQuery(feedback.getFeedbackByProduct, [product_id])
        return feedbacks;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}

const updateFeedback = async (id, rating, comment) => {
    try {
        await executeQuery(feedback.updateFeedback, [rating, comment, id])
        //console.log("success")
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}

const deleteFeedback = async (id) => {
    try {
        await executeQuery(feedback.deleteFeedback, [id]);
        //console.log("deleted successfully")
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}

const initializeDatabase = async () => {
    try {
        await createDatabaseIfNotExists()
        await executeQuery(userQueries.useDatabaseQuery);
        await createTableIfNotExists();
    } catch (error) {
        throw error;
    }
}
module.exports = {
    pool,
    initializeDatabase,
    insertUser,   
    updateUserPassword,   
    findUserByEmail,
    insertProduct,
    getAllProducts,
    getOneProduct,
    getBusinessProducts,
    updateProduct,
    deleteProduct,
    createCategories,
    getCategories,    
    updateUser,
    deleteUser,
    getOneUser,
    getAllUsers,
    deleteCategory,
    deleteUserProducts,    
    createProductCategories,
    getProductCategories,
    deleteProductCategory,
    updateUserProfile,
    updateProductImages,
    updateUserPlan,
    addAgent,
    getUsersByAgentId,
    getAllAgents,
    insertPayment,
    getAllPayments,
    getOnePayment,
    getPaymentByTransactionCode,
    updatePayment,
    deletePayment,
    insertService,
    getAllServices,
    getOneService,
    getUserServices,
    updateService,
    updateServiceImages,
    deleteService,
    myPayments,
    createServiceCategories,
    getServiceCategories,
    deleteServiceCategory,
    getProductsByCategories,
    getProductsOnOffer,
    setProductDiscount,
    getServicesByCategories,
    getServicesOnOffer,
    getGoldUsers,
    addCart,
    getCustomerCart,
    getcartById,
    deleteCart,
    addCartItem,
    getCartItems,
    updateCartItem,
    deleteCartItemById,
    deleteAllCartItems,
    insertCustomer,
    updateCustomer,
    getCustomerById,
    getCustomerByEmail,
    deleteCustomer,
    addOrder,
    getOrdersByCustomerId,
    getOrdersByOrderId,
    updateOrderStatus,
    deleteOrderById,
    addOrderItems,
    getOrderItemsByOrderId,
    deleteOrderItemsByOrderId,
    insertOtp,
    getOtp,
    removeOtp,
    updateCustomerPassword,
    updateProductQuantity,
    addLocation,
    updateLocation,
    deleteLocation,
    getAllLocations,
    getAllOrders,
    getLocationById,
    createFeedback,
    getFeedbackByProduct,
    updateFeedback,
    deleteFeedback
}