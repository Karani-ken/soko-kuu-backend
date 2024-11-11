const express = require('express');
const servicesController = require('../Controller/ServiceController');
const upload = require('../Middleware/uploads.middleware')
const {protect} = require('../Middleware/auth.middleware')
const router = express.Router();

router.post('/create',protect(), upload.array('service_images', 3), servicesController.createService);

router.get('/service/:service_id', servicesController.getAService);

// Get all services
router.get('/all', servicesController.getAllServices)

// Get services offered by a user
router.get('/user/:user_id', servicesController.getUserServices);

// Update service details
router.put('/update/:service_id', servicesController.updateAService);

// Update service images
router.put('/update-images/:service_id',protect(), upload.array('service_images', 5), servicesController.updateServiceImages);

// Delete a service
router.delete('/delete/:service_id', protect(),  servicesController.deleteService);
router.get('/exclusive-services', servicesController.getExclusiveServices)
router.get('/offers',servicesController.getServicesByOnOffers)
router.get('/categories/:category', servicesController.getServiceByCategory)

module.exports = router;