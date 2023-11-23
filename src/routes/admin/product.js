const productController = require('../../controllers/productController');

const productRoute = require('express').Router();

productRoute.get('/', productController.getAll);
productRoute.post('/create', productController.create);
productRoute.delete('/:id',  productController.delete);
productRoute.get('/:id',  productController.getProductInfo);
productRoute.put('/update/:id',  productController.editProduct);

module.exports = productRoute;