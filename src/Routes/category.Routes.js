const express = require('express');
//const { protect } = require('../Middleware/auth.middleware')
const categoryController = require('../Controller/categoriesController')
const upload = require('../Middleware/uploads.middleware')
const router = express.Router();

router.post('/add-new',upload.single("banner"),categoryController.addCategory);
router.get('/all-categories',categoryController.getAllCategories)
router.delete('/delete/:id', categoryController.deleteCategory)
router.post('/add-productcategory',upload.single("banner"), categoryController.addProductCategory)
router.get('/get-productcategories',categoryController.getAllProductCategories)
router.delete('/delete-productcategory/:id',categoryController.deleteProductCategory)
router.post('/add-serviceCategory', upload.single("banner"), categoryController.addServiceCategory)
router.get('/get-servicecategories',categoryController.getAllServiceCategories)
router.delete('/delete-servicecategory/:id',categoryController.deleteServiceCategory)

module.exports = router;               