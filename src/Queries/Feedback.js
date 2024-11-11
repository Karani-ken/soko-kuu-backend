const showFeedbackTable = `SHOW TABLES LIKE 'feedback'`

const createFeedbackTable = `CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   
);
`

const createFeedback = 'INSERT INTO feedback (product_id, user_id, rating, comment) VALUES (UNHEX(REPLACE(?, "-", "")), UNHEX(REPLACE(?, "-", "")), ?, ?);'
const  getFeedbackByProduct = 'SELECT HEX(product_id) as product_id, HEX(user_id) as user_id , rating, comment FROM feedback WHERE product_id = UNHEX(?)'
const updateFeedback = 'UPDATE feedback SET rating = ?, comment = ? WHERE id = ?'
const deleteFeedback= 'DELETE FROM feedback WHERE id = ?'

module.exports = {
    showFeedbackTable,
    createFeedbackTable,
    createFeedback,
    getFeedbackByProduct,
    updateFeedback,
    deleteFeedback
}

