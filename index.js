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
const rateLimit = require('express-rate-limit');  // Import express-rate-limit
const port = process.env.PORT;
const app = express();

app.set('trust proxy', 1);
// Set up rate limiter middleware for API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500,  // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});


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
app.use('/auth', apiLimiter, authRoutes);
app.use('/products', apiLimiter, productRoutes);
app.use('/categories', apiLimiter, categoryRoutes);
app.use('/services', apiLimiter, serviceRoutes);
app.use('/payments', paymentRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', apiLimiter, orderRoutes);
app.use('/customer', apiLimiter, customerRoutes);
app.use('/locations', locationRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/houses', apiLimiter, houseRoutes);

// Start the server
module.exports = app;

// Start the server if not in testing environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}