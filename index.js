require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbHandler = require('./src/DbHandler/DbHandler');
const authRoutes = require("./src/Routes/auth.Routes");
const productRoutes = require('./src/Routes/product.Routes');
const categoryRoutes = require('./src/Routes/category.Routes');
const serviceRoutes = require('./src/Routes/service.Routes');
const paymentRoutes = require('./src/Routes/payment.Routes');
const cartRoutes = require('./src/Routes/cart.Routes');
const customerRoutes = require('./src/Routes/customer.Routes');
const orderRoutes = require('./src/Routes/order.Routes');
const locationRoutes = require('./src/Routes/location.Routes');
const feedbackRoutes = require('./src/Routes/feedback.Routes');
const houseRoutes = require('./src/Routes/house.Routes');

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to the database
dbHandler.pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("MySQL connected successfully");
    dbHandler.initializeDatabase()
        .then(() => {
            connection.release();
        })
        .catch((err) => {
            connection.release();
            throw err;
        });
});



// Define your API routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/services', serviceRoutes);
app.use('/payments', paymentRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/customer', customerRoutes);
app.use('/locations', locationRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/houses', houseRoutes);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
