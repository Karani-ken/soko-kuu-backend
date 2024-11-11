const express = require('express');
const cartController = require('../Controller/cartController'); // Assuming cartController.js is in controllers folder
const router = express.Router();
const {protect} = require('../Middleware/auth.middleware')
// Routes for cart
router.post('/add-cart', cartController.createCart); // Create a new cart
router.get('/cart/:customer_id', cartController.getCustomerCart); // Get cart by customer
router.delete('/delete/cart/:cart_id', cartController.deleteCart); // Delete a cart

// Routes for cart items
router.post('/add-cart/:cart_id', cartController.addCartItem); // Add item to cart
router.get('/cart-items/:cart_id', cartController.getCartItems); // Get items in cart
router.put('/update/items/:cart_item_id', cartController.updateCartItem); // Update item in cart
router.delete('/delete/items/:cart_item_id', cartController.deleteCartItemById); // Delete an item from cart
router.delete('/delete/all-items/:cart_id', cartController.clearCartItems); // Clear all items in cart

module.exports = router;
