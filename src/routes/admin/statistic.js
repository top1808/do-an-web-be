const statisticController = require('../../controllers/statisticController');

const statisticRoute = require('express').Router();

statisticRoute.get('/', statisticController.getStatistic);
statisticRoute.get('/get-sale-of-range', statisticController.getSaleOfRange);

module.exports = statisticRoute;