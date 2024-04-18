const reviewController = require('../../controllers/reviewController');


const reviewRoute = require('express').Router();

reviewRoute.get('/', reviewController.getAll);
reviewRoute.get('/:id',  reviewController.getById);

module.exports = reviewRoute;