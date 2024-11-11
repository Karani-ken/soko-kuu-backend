const express = require('express');
const router = express.Router();
const paymentsController = require('../Controller/PaymentController');

// Create a payment
router.post('/create', paymentsController.createPayment);

// Get all payments
router.get('/all-payments', paymentsController.getAllPayments);

// Get a payment by ID
router.get('/:payment_id', paymentsController.getOnePayment);

//get my payments

router.get('/my-payments/:id', paymentsController.getMyPayments)

// Get payment by transaction code
router.get('/transaction/:transaction_code', paymentsController.getPaymentByTransactionCode);

// Update a payment
router.put('/update/:payment_id', paymentsController.updatePayment);

// Delete a payment
router.delete('/delete/:payment_id', paymentsController.deletePayment);

module.exports = router;
