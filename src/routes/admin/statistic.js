const statisticController = require('../../controllers/statisticController');

const statisticRoute = require('express').Router();

statisticRoute.get('/', statisticController.getStatistic);

module.exports = statisticRoute;