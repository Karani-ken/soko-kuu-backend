const express = require('express');
const { newHouse, getAllHouses,getUserHouses, getASingle,updateHouse,deleteHouse } = require('../Controller/houseController'); // Adjust the path as necessary
const {protect} = require('../Middleware/auth.middleware')
const upload = require('../Middleware/uploads.middleware');

const router = express.Router();

// Define the route for adding a new house
router.post('/add-house',protect(), upload.array("images", 10), newHouse);
router.get('/all-houses', getAllHouses);
router.get('/my-houses', protect(), getUserHouses);
router.get('/house/:id', getASingle);
router.put('/update/:id',protect(),upload.array("images", 10), updateHouse);
router.delete('/delete/:id', protect(), deleteHouse);

module.exports = router;
