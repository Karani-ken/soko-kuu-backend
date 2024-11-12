const cartHandler = require('../DbHandler/DbHandler'); // Assuming dbHandler.js is in dbHandler folder

// Create a new cart for the customer
const createCart = async (req, res) => {
    const { customer_id } = req.body;
    if (!customer_id) {
        return res.status(400).json({ error: "Customer ID is required" });
    }
    //checki if user already has a cart
    const cart = await cartHandler.getCustomerCart(customer_id)
    if (cart.length > 0) {
        return res.status(400).json({ message: "user already has a cart" })
    }

    try {
        const result = await cartHandler.addCart(customer_id);
        return res.status(201).json({ message: "Cart created successfully", cart: result });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Error creating cart", err });
    }
};

// Get the cart of a specific customer
const getCustomerCart = async (req, res) => {
    const { customer_id } = req.params;
  
    try {
        const cart = await cartHandler.getCustomerCart(customer_id);
       
        if (cart.length === 0) {
            return res.status(404).json({ error: "Cart not found" });
        }
        return res.status(200).json({message:"success",cart: cart});
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Error retrieving cart" });
    }
};

// Delete a cart
const deleteCart = async (req, res) => {
    const { cart_id } = req.params;
    try {
        await cartHandler.deleteCart(cart_id);
        return res.status(200).json({ message: "Cart deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Error deleting cart" });
    }
};

// Add item to the cart
// Add item to the cart
const addCartItem = async (req, res) => {
  
    const { product_id, product_name, product_price, quantity } = req.body;
    const { cart_id } = req.params;

    // Check for required fields
    if (!product_id || !product_name || !product_price || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (!cart_id) {
        return res.status(400).json({ error: "Cart ID is required!" });
    }

    try {
        // Get the cart items by cart_id
        const cartItems = await cartHandler.getCartItems(cart_id);
      
        // Check if the cart has any items
        const existingItem = cartItems.find(item => item.product_id === product_id);
        //console.log(existingItem.product_name)
        if (existingItem) {   
            // Update the existing item's quantity
            const newQuantity = existingItem.quantity + 1; // Update the quantity
            await cartHandler.updateCartItem(existingItem.cart_item_id, newQuantity); // Assuming you have this function in your handler
           
            return res.status(200).json({ message: "Item quantity updated in cart" });
        } else {
            // Add the item to the cart   
            await cartHandler.addCartItem(product_id, cart_id, product_name, product_price, quantity);
             
            return res.status(201).json({ message: "Item added to cart" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error adding item to cart" });
    }
};

// Get all items in a cart
const getCartItems = async (req, res) => {
    const { cart_id } = req.params;
    try {
        const items = await cartHandler.getCartItems(cart_id);
        const cart = await cartHandler.getcartById(cart_id)
        if (!cart.length) {
            return res.status(200).json({ error: 'cart not found!' })
        }

        let totalPrice = 0;
        let customer_id = cart[0].customer_id
        //console.log(cart[0].customer_id)
        for (let item of items) {
            totalPrice += item.product_price * item.quantity
        }
        const newItems = {
            items,
            totalPrice,
            customer_id
        }
        //console.log(newItems)
        return res.status(200).json(newItems);
    } catch (err) {
        return res.status(500).json({ error: "Error retrieving cart items" });
    }
};

// Update cart item
const updateCartItem = async (req, res) => {
    const { quantity } = req.body;
  
    const { cart_item_id } = req.params
  
    if (!cart_item_id || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        await cartHandler.updateCartItem(cart_item_id, quantity);
        return res.status(200).json({ message: "Cart item updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Error updating cart item" });
    }
};

// Delete an item from the cart
const deleteCartItemById = async (req, res) => {
    const { cart_item_id } = req.params;
    try {
        await cartHandler.deleteCartItemById(cart_item_id);
        return res.status(200).json({ message: "Item removed from cart" });
    } catch (err) {
        return res.status(500).json({ error: "Error deleting item from cart" });
    }
};

// Clear all items in the cart
const clearCartItems = async (req, res) => {
    const { cart_id } = req.params;
    try {
        await cartHandler.deleteAllCartItems(cart_id);
        return res.status(200).json({ message: "Cart cleared" });
    } catch (err) {
        return res.status(500).json({ error: "Error clearing cart" });
    }
};

module.exports = {
    createCart,
    getCustomerCart,
    deleteCart,
    addCartItem,
    getCartItems,
    updateCartItem,
    deleteCartItemById,
    clearCartItems
};
