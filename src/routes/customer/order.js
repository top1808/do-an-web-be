const orderController = require('../../controllers/orderController');

const orderRoute = require('express').Router();

orderRoute.get('/', orderController.getMyOrder);
orderRoute.get('/:id',  orderController.getMyOrderDetails);

module.exports = orderRoute;