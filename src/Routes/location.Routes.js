// locationRoutes.js
const express = require('express');
const router = express.Router();
const {
    addLocationController,
    updateLocationController,
    deleteLocationController,
    getAllLocationsController,
    getSingleLocation
} = require('../Controller/LocationsController');

// Route to add a location
router.post('/add', addLocationController);

// Route to update a location
router.put('/update/:location_id', updateLocationController);

// Route to delete a location
router.delete('/delete/:location_id', deleteLocationController);

// Route to get all locations
router.get('/all', getAllLocationsController);

//get a single location
router.get('/get/:id', getSingleLocation)

module.exports = router;
