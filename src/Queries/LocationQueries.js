const showLocationTable = `SHOW TABLES LIKE "locations"`;

const createLocationsTable = `
CREATE TABLE locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(255) NOT NULL,
    charges DECIMAL(10, 2) NOT NULL  
);
`

const insertLocation = `
INSERT INTO locations (location_name, charges)
VALUES (?, ?);`

const updateLocation = `UPDATE locations
SET location_name = ? , charges = ?
WHERE location_id = ?;
`
const deleteLocation = `DELETE FROM locations
WHERE location_id = ?;
`
const selectLocations = `SELECT * FROM locations;
`

const getLocationById = `SELECT * FROM locations WHERE location_id`

module.exports = {
    createLocationsTable,
    showLocationTable,
    insertLocation,
    updateLocation,
    deleteLocation,
    selectLocations,
    getLocationById
}

