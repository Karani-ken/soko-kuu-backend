const showCartTable = `SHOW TABLES LIKE "cart"`
const createCart = `CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id BINARY(16) NOT NULL,    
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);`
const insertCart = `INSERT INTO cart (customer_id) VALUES (?);`
const getCustomerCart = `SELECT HEX(customer_id) as customer_id, cart_id, date_added FROM cart 
WHERE customer_id = UNHEX(?);
`
const getCartById = `SELECT HEX(customer_id) as customer_id, cart_id, date_added FROM cart WHERE cart_id = ?`;

const deleteCart = `DELETE FROM cart WHERE cart_id = ?;
`
   
//create cart items table
const showCartItemsTable = `SHOW TABLES LIKE "cart_items"`     

const createCartItemsTable = `CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    cart_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraint linking to cart table
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE
);
`
const addCartItems = `INSERT INTO cart_items (product_id, cart_id, product_name, product_price, quantity) 
VALUES (?, ?, ?, ?, ?);
`
const updateCartItems = `UPDATE cart_items 
SET  quantity = ?
WHERE cart_item_id = ?;
`
const getCartItems = `SELECT HEX(product_id) as product_id, cart_id, product_name, product_price, quantity 
FROM cart_items 
WHERE cart_id = ?;
`
const deleteCartItemById = `DELETE FROM cart_items 
WHERE cart_item_id = ?;
`
const deleteAllCartItems = `DELETE FROM cart_items 
WHERE cart_id = ?;
`


module.exports = {
    // Cart queries
    showCartTable,
    createCart,
    insertCart,
    getCustomerCart,
    getCartById,
    deleteCart,

    // Cart Items queries
    showCartItemsTable,
    createCartItemsTable,
    addCartItems,
    updateCartItems,
    getCartItems,
    deleteCartItemById,
    deleteAllCartItems
};





