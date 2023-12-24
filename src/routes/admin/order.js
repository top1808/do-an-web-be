const orderController = require('../../controllers/orderController');

const orderRoute = require('express').Router();

orderRoute.get('/', orderController.getAll);
orderRoute.post('/create', orderController.create);
orderRoute.delete('/:id',  orderController.delete);
orderRoute.put('/update/:id',  orderController.edit);
orderRoute.get('/:id',  orderController.getById);
orderRoute.put('/change-status/:id',  orderController.changeStatus);

module.exports = orderRoute;