const showOtpTable = `SHOW TABLES LIKE "otp"`
const createOtpTable = `CREATE TABLE otp (
    email VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    expiresAt TIMESTAMP NOT NULL, 
    PRIMARY KEY (email)
);
`
const insertCode = `INSERT INTO otp (email, code, expiresAt) 
VALUES (?, ?, ?);
`
const findOtp = `SELECT * FROM otp 
WHERE email = ?;
`
const deleteOtp = `DELETE FROM otp 
WHERE email = ?;
`
module.exports = {
    showOtpTable,
    createOtpTable,
    insertCode,
    findOtp,
    deleteOtp
} 