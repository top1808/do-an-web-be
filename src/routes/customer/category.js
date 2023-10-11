const categoryController = require('../../controllers/categoryController');

const categoryRoute = require('express').Router();

categoryRoute.get('/', categoryController.getCategories);

module.exports = categoryRoute;