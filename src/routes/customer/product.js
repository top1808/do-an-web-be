const productController = require('../../controllers/productController');

const productRoute = require('express').Router();

productRoute.get('/', productController.getProducts);
productRoute.get('/:id', productController.getProductInfo);

module.exports = productRoute;