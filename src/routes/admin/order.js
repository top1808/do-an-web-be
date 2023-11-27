const orderController = require('../../controllers/orderController');

const orderRoute = require('express').Router();

orderRoute.get('/', orderController.getAll);
orderRoute.post('/create', orderController.create);
orderRoute.delete('/:id',  orderController.delete);
orderRoute.put('/update/:id',  orderController.edit);
orderRoute.get('/:id',  orderController.getById);

module.exports = orderRoute;