const productController = require('../../controllers/productController');

const productRoute = require('express').Router();

productRoute.get('/', productController.getProducts);
productRoute.get('/:id', productController.getProductInfo);
productRoute.get('/get-by-category/:categoryId', productController.getProductByCategory);

module.exports = productRoute;