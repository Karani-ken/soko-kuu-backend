const showCustomersTable = `SHOW TABLES LIKE "customers"`


const createCustomerTable = `CREATE TABLE customers (
    customer_id BINARY(16) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(100) NOT NULL UNIQUE,
    googleId TEXT,
    town VARCHAR(100),
    county VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`

const insertCustomer = `INSERT INTO customers ( customer_id, customer_name, phone, email,password, googleId , town, county ) 
VALUES (UNHEX(REPLACE(UUID(), '-', '')), ?, ?, ?, ?, ?, ?, ?)`;

const updateCustomer = `UPDATE customers 
SET customer_name = ?, phone = ?, email = ?, town = ?, county = ?
WHERE customer_id = UNHEX(?)`;

const getCustomerById = `SELECT HEX(customer_id) as customer_id, customer_name, phone, email, town, county, date_created        
FROM customers 
WHERE customer_id = UNHEX(?);`;
const getCustomerByEmail = `SELECT HEX(customer_id) as customer_id, customer_name, email, password FROM customers WHERE email = ?`
const updatePassword = `UPDATE customers SET password = ? WHERE email = ?`

const deleteCustomer = `DELETE FROM customers 
WHERE customer_id = UNHEX(?);`;

module.exports = {
    showCustomersTable,
    createCustomerTable,
    insertCustomer,
    updateCustomer,
    getCustomerById,
    getCustomerByEmail,
    deleteCustomer,
    updatePassword
};
