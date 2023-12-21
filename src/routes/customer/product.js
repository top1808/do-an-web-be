const productController = require('../../controllers/productController');

const productRoute = require('express').Router();

productRoute.get('/', productController.getProducts);
productRoute.get('/:id', productController.getProductInfo);
productRoute.get('/get-by-category/:categoryId', productController.getProductByCategory);
productRoute.get('/get-product-relative/:id', productController.getProductRelative);
productRoute.get('/search/:search', productController.searchProducts);

module.exports = productRoute;