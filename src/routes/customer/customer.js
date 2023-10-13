const customerController = require('../../controllers/customerController');

const customerRoute = require('express').Router();

customerRoute.get('/', customerController.getAll);
customerRoute.get('/:id', customerController.getById);
customerRoute.post('/create', customerController.create);
customerRoute.delete('/:id',  customerController.delete);

module.exports = customerRoute;