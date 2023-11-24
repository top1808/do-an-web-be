const customerController = require('../../controllers/customerController');

const customerRoute = require('express').Router();

customerRoute.get('/', customerController.getAll);
customerRoute.post('/create', customerController.create);
customerRoute.delete('/:id',  customerController.delete);
customerRoute.put('/update/:id',  customerController.edit);
customerRoute.get('/:id',  customerController.getById);

module.exports = customerRoute;