const showPaymentsTable = 'SHOW TABLES LIKE "payments"';

const createPaymentsTable = `CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_code VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    agent_id INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
const insertPayment = `INSERT INTO payments (transaction_code, name, email, phone, agent_id)
VALUES (?, ?, ?, ?, ?);
`
const selectAllPayments = `SELECT * FROM payments;
`
const selectPaymentById = `SELECT * FROM payments WHERE payment_id = ?;
`
const selectAgentPayments = `SELECT * FROM payments WHERE agent_id = ?`


const selectPaymentByTransactionCode = `SELECT * FROM payments WHERE transaction_code = ?;`

const deletePayment = `DELETE FROM payments WHERE payment_id = ?;`

const updatePayment = `UPDATE payments
SET name = ?, email = ?, phone = ?, agent_id = ?
WHERE payment_id = ?;`


// Exporting the queries
module.exports = {
    showPaymentsTable,
    insertPayment,
    selectAllPayments,
    selectPaymentById,
    selectPaymentByTransactionCode,
    updatePayment,
    deletePayment,
    createPaymentsTable,  
    selectAgentPayments  
  };