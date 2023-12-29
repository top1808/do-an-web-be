const discountProgramController = require('../../controllers/discountProgramController');

const discountProgramRoute = require('express').Router();

discountProgramRoute.get('/get-all', discountProgramController.getListDiscountProgram);

module.exports = discountProgramRoute;