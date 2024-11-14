// Order Table
const showOrdersTable = `SHOW TABLES LIKE "orders"`;

const createOrdersTable = `CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id BINARY(16),
    payment_code VARCHAR(255),   
    order_status ENUM('Placed','Confirmed','Pending Delivery','Delivered', 'Cancelled') DEFAULT 'Placed',
    location VARCHAR(255),
    location_pin VARCHAR(255),  -- Ensure this is intentional
    total_price DECIMAL(10, 2),
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)  ON DELETE CASCADE
)`;

// Order Items Table
const showOrderItemsTable = `SHOW TABLES LIKE "order_items"`;

const createOrderItemsTable = `CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id BINARY(16),
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP   
)`;     

// Insert Orders
const addOrder = `INSERT INTO orders (customer_id, payment_code, location, location_pin, total_price) 
VALUES (UNHEX(REPLACE(?, '-', '')), ?, ?, ?, ?);`;      

// Insert Order Items
const addOrderItems = `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity) 
VALUES (?, UNHEX(REPLACE(?, '-', '')), ?, ?, ?);`;

// Get Orders by Customer ID
const getOrdersByCustomerId = `SELECT HEX(customer_id) as customer_id, order_id, payment_code, location, location_pin, total_price, date_created, date_updated FROM orders WHERE customer_id = UNHEX(?);`

//get order by order id

const getOrdersById = `SELECT HEX(customer_id) as customer_id, order_id, payment_code, location, location_pin, total_price, date_created, date_updated FROM orders WHERE order_id = ?;`;

// Get Order Items by Order ID
const getOrderItemsByOrderId = `SELECT * FROM order_items WHERE order_id = ?;`;

// Update Order Status
const updateOrderStatus = `UPDATE orders 
SET order_status = ? 
WHERE order_id = ?;`

// Delete Order by ID
const deleteOrderById = `DELETE FROM orders WHERE order_id = ?;`;

// Delete Order Items by Order ID
const deleteOrderItemsByOrderId = `DELETE FROM order_items WHERE order_id = ?;`

const getAllOrders = `SELECT HEX(customer_id) as customer_id, order_id, payment_code, location, location_pin, total_price, date_created, date_updated FROM orders`;


module.exports = { 
    showOrdersTable,
    createOrdersTable,
    showOrderItemsTable,
    createOrderItemsTable,
    getOrdersById,
    addOrder,
    addOrderItems,
    getOrdersByCustomerId,
    getOrderItemsByOrderId,
    updateOrderStatus,
    deleteOrderById,
    deleteOrderItemsByOrderId,
    getAllOrders 
}