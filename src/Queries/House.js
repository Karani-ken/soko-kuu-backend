const showHouseTable = `SHOW TABLES LIKE 'houses'`

const createHouseTable = `CREATE TABLE houses (
    house_id BINARY(16) PRIMARY KEY,
    house_name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    total_units INT,
    units_available INT,
    category VARCHAR(100),
    description TEXT,
    location VARCHAR(255),
    town VARCHAR(100),
    charges INT,
    county VARCHAR(100),
    location_pin VARCHAR(100),
    images TEXT,  
    FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE CASCADE;
);
`

//insert house
const insertHouse = `INSERT INTO houses (house_id,house_name, user_id, total_units, units_available, category,description, location, town, charges, county, location_pin, images) 
VALUES (UNHEX(REPLACE(UUID(), '-', '')), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`
//get all houses
const getAllHouses = `
SELECT 
    HEX(house_id) AS house_id, 
    house_name, 
    user_id, 
    total_units, 
    units_available, 
    category, 
    description,
    location, 
    town, 
    charges,     
    county, 
    location_pin, 
    images 
FROM houses;
`;

//get by user id
const getHousesByUserId = `SELECT 
    HEX(house_id) AS house_id, 
    house_name, 
    user_id, 
    total_units, 
    units_available, 
    category, 
    description,
    location, 
    town, 
    charges, 
    county, 
    location_pin, 
    images 
FROM houses WHERE user_id = ?;`

//get house by house id (join with users table to get user infomation including user_id, name, email, password,phone)
const getHouseById = `SELECT 
    HEX(h.house_id) AS house_id,
    h.house_name,
    h.location,
    h.total_units,
    h.units_available,
    h.category,
    h.description,
    h.town,
    h.charges,
    h.county,
    h.location_pin,
    h.images,
    u.id,
    u.name,
    u.email,    
    u.phone
FROM 
    houses h
JOIN 
    users u ON h.user_id = u.id

WHERE 
    h.house_id = UNHEX(?);
`
//update house
const updateHouse = `UPDATE houses 
SET 
    house_name = ?, 
    total_units = ?,
    units_available = ?,
    category = ?,
    description = ?,
    location = ?, 
    town = ?, 
    charges = ?, 
    county = ?, 
    location_pin = ?, 
    images = ?
WHERE 
    house_id = UNHEX(?) AND 
    user_id = ?;
`;


//delete house
const deleteHouse = `DELETE FROM houses WHERE house_id = UNHEX(?) AND user_id = ?;
`

module.exports = {
    showHouseTable,
    createHouseTable,
    insertHouse,
    getAllHouses,
    getHouseById,
    getHousesByUserId,
    updateHouse,
    deleteHouse
}