// locationController.js
const { addLocation, updateLocation, deleteLocation, getAllLocations, getLocationById } = require('../DbHandler/DbHandler');

// Add a new location
const addLocationController = async (req, res) => {
    const { location_name, charges } = req.body;
    try {
        await addLocation(location_name, charges);
        res.status(201).json({ message: 'Location added successfully' });
    } catch (error) {
        console.error('Error adding location:', error);
        res.status(500).json({ message: 'Failed to add location', error });
    }
};
const getSingleLocation = async (req, res) => {
    const {id} = req.params
    try {
        const location = await getLocationById(id);
        return res.status(200).json(location)
    } catch (error) {
        console.error('Error adding location:', error);
        res.status(500).json({ message: 'Failed to add location', error });
    }
}

// Update an existing location
const updateLocationController = async (req, res) => {
    const { location_id } = req.params;
    const { location_name, charges } = req.body;    
    try {
        await updateLocation(location_id, location_name, charges);
        res.status(200).json({ message: 'Location updated successfully' });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Failed to update location', error });
    }
};

// Delete a location
const deleteLocationController = async (req, res) => {
    const { location_id } = req.params;
    try {
        await deleteLocation(location_id);
        res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
        console.error('Error deleting location:', error);
        res.status(500).json({ message: 'Failed to delete location', error });
    }
};

// Get all locations
const getAllLocationsController = async (req, res) => {
    try {
        const locations = await getAllLocations();
       
        res.status(200).json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ message: 'Failed to fetch locations', error });
    }
};

module.exports = {
    addLocationController,
    updateLocationController,
    deleteLocationController,
    getAllLocationsController,
    getSingleLocation 
};
