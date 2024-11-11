const dbConfig = require('../Config/dbConfig')

// Create database if not exists
const createDatabase = `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`;

// Show specific database
const showDatabases = `SHOW DATABASES LIKE "${dbConfig.database}"`;

// Show users table if it exists
const showUsersTable = 'SHOW TABLES LIKE "users"';

// Use specific database
const useDatabaseQuery = `USE \`${dbConfig.database}\``;

// Create the users table with all fields
const usersTable = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'agent','rentals') NOT NULL DEFAULT 'user',
    subscription ENUM('bronze', 'silver', 'gold', 'basic'),
    phone VARCHAR(20),
    location VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(100),
    county VARCHAR(100),
    postal_code VARCHAR(20),
    type ENUM('products', 'services', 'both'),
    category VARCHAR(255),
    profile_pic TEXT,
    public_id VARCHAR(255),
    description TEXT,
    agent_id INT, -- This is the foreign key referencing the agent
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP     
);
`

// Insert a new user with all required fields
const createUser = 'INSERT INTO users (name, email, password, phone, location, category, profile_pic, type, description, address, city, county, agent_id) VALUES (?,  ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?, ?)';
const insertAgent = `INSERT INTO users (name, email, password, phone, county, city, role) VALUES(?, ?, ?, ?, ?, ?, ?)`;
// Find a user by email
const findUserByEmail = 'SELECT * FROM users WHERE email = ?';

//find a user by id
const findUserById = `SELECT * FROM users WHERE id = ?`;

// Update user's OTP by email





// Update user password and clear OTP by email
const updateUserPassword = 'UPDATE users SET password = ? WHERE email = ?';

// Update user details (e.g., name, phone, locations, category, profile_pic, description, role)
const updateUser = `UPDATE users 
                    SET name = ?, phone = ?, location = ?, category = ?, description = ?, type = ?, address = ?, city = ?, county = ?, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?`;

const updateUserProfilePic = `UPDATE users 
                    SET profile_pic = ?, public_id = ?, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?`;


                   
                   
 //get users
 const getUsers = `SELECT * FROM users WHERE role = 'user'`;
 const getAgents = `SELECT * FROM users WHERE role = 'agent'`;

// Delete a user by email
const deleteUser = 'DELETE FROM users WHERE id = ?';

//update subscription type

const updatePlan = `UPDATE users SET subscription = ? WHERE id = ?`;

const getUsersByAgentId = `SELECT * FROM users WHERE agent_id = ?`;

const getGoldUsers = `SELECT * FROM users WHERE subscription = "gold"`

module.exports = {
    createDatabase,
    useDatabaseQuery,
    showDatabases,
    showUsersTable,
    usersTable,
    createUser,
    findUserByEmail,   
    updateUserPassword,
    updateUser,
    deleteUser,
    findUserById,
    getUsers,
    updateUserProfilePic,
    updatePlan,
    insertAgent,
    getUsersByAgentId,
    getAgents,
    getGoldUsers
}
  