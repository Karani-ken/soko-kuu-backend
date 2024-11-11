const mysql = require('mysql2')
const dbConfig = require('../Config/dbConfig')
const houseQueries = require('../Queries/House')
const pool = mysql.createPool(dbConfig); /* connection pool is technique 
used to efficiently manage and reuse database connections improving performance */

const executeQuery = (query, values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, values, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

//insert house 
const addHouse = async (houseData) => {
    const { house_name,
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
        images } = houseData

    try {
        const result = await executeQuery(houseQueries.insertHouse, [house_name, user_id, total_units, units_available, category, description, location, town, charges, county, location_pin, images])
        //console.log(result.insertId)
        return {
            success: true,
            message: 'House added successfully',
        }
    } catch (error) {
        console.error('Error adding house:', error);
        return {
            success: false,
            message: error.message
        };
    }
}
//get All houses 
const getAllHouses = async () => {
    try {
        const houses = await executeQuery(houseQueries.getAllHouses)

        return {
            success: true,
            houses: houses
        }
    } catch (error) {
        console.error('Error adding house:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

//getHousesByUserId
const getHousesByUserId = async (user_id) => {
    try {
        const houses = await executeQuery(houseQueries.getHousesByUserId, [user_id]);


        return {
            success: true,
            houses: houses
        }
    } catch (error) {

        return {
            success: false,
            message: error.message
        };
    }
}
const getHouseById = async (house_id) => {
    try {
        const houses = await executeQuery(houseQueries.getHouseById, [house_id]);

        return {
            success: true,
            houses: houses
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

//update house
const updateHouse = async (updateHouseData) => {
    try {
        const { house_name,
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
            images,
            house_id } = updateHouseData

        const response = await executeQuery(houseQueries.updateHouse, [house_name,
            total_units,
            units_available,
            category,
            description,
            location,
            town,
            charges,
            county,
            location_pin,
            images,
            house_id,
            user_id])

        //console.log(response)
        return {
            success: true,
            message: 'House updated successfully',    
        }

    } catch (error) {
        console.error('Error adding house:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

const deleteHouse = async (house_id, user_id) => {
    try {
        const result = executeQuery(houseQueries.deleteHouse, [house_id, user_id]);
        return {
            success: true,
            message: 'House updated successfully',
        }
    } catch (error) {
        console.error('Error adding house:', error);
        return {
            success: false,
            message: error.message
        };
    }
}



module.exports = {
    addHouse,
    getAllHouses,
    getHousesByUserId,
    getHouseById,
    updateHouse,
    deleteHouse
}




