const express = require('express');
const router = express.Router();
const customerController = require('../Controller/CustomerController');
const {protect} = require('../Middleware/auth.middleware')
// Register a customer
router.post('/register', customerController.registerCustomer);   

router.post('/send-otp', customerController.requestPasswordReset)

router.post('/reset-password', customerController.resetPassword)
// Login a customer
router.post('/login', customerController.loginCustomer);
router.post('/login/social-accounts', customerController.loginWithSocialAccounts)

//google login route
router.get('/auth/google/callback', customerController.googleLoginCustomer);
// Update customer
router.put('/customers/:customer_id', customerController.updateCustomer);

// Get customer by ID
router.get('/customers/:customer_id', customerController.getCustomer);

// Delete customer by ID
router.delete('/customers/:customer_id', protect(true), customerController.deleteCustomer);

module.exports = router;     
