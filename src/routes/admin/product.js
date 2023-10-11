const productController = require('../../controllers/productController');

const productRoute = require('express').Router();

productRoute.get('/', productController.getAll);
productRoute.post('/create', productController.create);
productRoute.delete('/:id',  productController.delete);

module.exports = productRoute;