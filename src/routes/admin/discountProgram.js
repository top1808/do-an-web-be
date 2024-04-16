const discountProgramController = require('../../controllers/discountProgramController');

const discountProgramRoute = require('express').Router();

discountProgramRoute.get('/', discountProgramController.getData);
discountProgramRoute.post('/create', discountProgramController.create);
discountProgramRoute.delete('/:id',  discountProgramController.delete);
discountProgramRoute.put('/update/:id',  discountProgramController.edit);
discountProgramRoute.get('/:id',  discountProgramController.getById);
discountProgramRoute.put('/change-status/:id',  discountProgramController.changeStatus);

module.exports = discountProgramRoute;