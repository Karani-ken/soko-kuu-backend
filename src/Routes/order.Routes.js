const express = require('express');
const orderController = require('../Controller/ordersController');
const router = express.Router();
const {protect} = require('../Middleware/auth.middleware')

// Order routes
router.post('/place-order', orderController.createOrder); // remember to protect the route
router.get('/customer-orders/:customer_id', orderController.getOrdersByCustomerId); // Get orders by customer ID
router.get('/order/items/:order_id', orderController.getOrderItemsByOrderId); // Get order items by order ID
router.put('/update-status/:order_id', orderController.updateOrderStatus); // Update order status
router.delete('/order/:order_id', orderController.deleteOrderById); // Delete order by ID
router.get('/get-order/:order_id', orderController.getOrdersByOrderId);
router.get('/get-orders', orderController.getOrders);
router.get('/checkout-id/:checkoutRequestID', orderController.getOrderCheckoutId)
router.post('/payment-callback',orderController.paymentCallback)

module.exports = router;
