const productController = require('../../controllers/productController');

const productRoute = require('express').Router();

productRoute.get('/', productController.getProducts);

module.exports = productRoute;