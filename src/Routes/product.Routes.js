const express = require('express');
const productController = require('../Controller/productsController');
const upload = require('../Middleware/uploads.middleware')
const {protect} = require('../Middleware/auth.middleware')
const router = express.Router();

router.post('/create',upload.array("product_images", 3),productController.createProduct);
router.get('/products/:user_id', productController.getAllProducts)
router.get('/product/:product_id',productController.getAProduct);
router.put('/update/:product_id',protect(), productController.updateAProduct); //update details
router.put('/update-images/:product_id',protect(), upload.array("product_images", 3), productController.updateProductImages); //update images
router.delete('/delete/:product_id', protect(), productController.deleteProduct);
router.get('/all', productController.getProducts)
router.get('/exclusive-products', productController.getExclusiveProducts);
router.get('/category/:category', productController.getProductByCategory)
router.get('/offers', productController.getProductByOnOffers)
router.put('/update/quantity',protect(), productController.updateProductQuantity)

module.exports = router        