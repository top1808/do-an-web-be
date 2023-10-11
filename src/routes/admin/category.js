const categoryController = require('../../controllers/categoryController');

const categoryRoute = require('express').Router();

categoryRoute.get('/', categoryController.getAll);
categoryRoute.post('/create', categoryController.create);
categoryRoute.delete('/:id',  categoryController.delete);

module.exports = categoryRoute;