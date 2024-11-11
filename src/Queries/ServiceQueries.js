// Queries for services table
const showServiceTable = 'SHOW TABLES LIKE "services"';

const createServiceTable = `CREATE TABLE services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    service_description TEXT,
    service_charges DECIMAL(10, 2) NOT NULL,
    user_id INT,
    offer ENUM('yes', 'no') DEFAULT 'no',
    service_images TEXT,
    public_ids TEXT,
    service_category VARCHAR(255),  -- Assuming service_category should be a VARCHAR
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`;

const insertIntoTable = `INSERT INTO services (service_name, service_description, service_charges, user_id, offer, service_images, service_category)
VALUES (?, ?, ?, ?, ?, ?, ?);`;

const selectAllServices = `SELECT * FROM services;`;

const getOneService = `SELECT * FROM services WHERE service_id = ?;`;

const getServicesOfferedByUsers = `SELECT * FROM services WHERE user_id = ?;`;

const updateService = `UPDATE services
SET service_name = ?,
    service_description = ?,
    service_charges = ?,
    offer = ?,   
    service_category = ?
WHERE service_id = ?;`

const updateProductImages = `UPDATE services
SET service_images = ? WHERE service_id = ?;
`

const deleteService = `DELETE FROM services WHERE service_id = ?;`;

const getServicesByCategory = `SELECT * FROM services WHERE service_category = ?`

const getServicesOnOffer = `SELECT * FROM services WHERE offer = "yes"`

// Exporting the queries
module.exports = {
  showServiceTable,
  createServiceTable,
  insertIntoTable,
  selectAllServices,
  getOneService,
  getServicesOfferedByUsers,
  updateService,
  deleteService,
  updateProductImages,
  getServicesByCategory,
  getServicesOnOffer

};
