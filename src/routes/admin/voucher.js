const voucherController = require('../../controllers/voucherController');

const voucherRoute = require('express').Router();

voucherRoute.get('/', voucherController.getData);
voucherRoute.post('/create', voucherController.create);
voucherRoute.delete('/:id',  voucherController.delete);
voucherRoute.put('/update/:id',  voucherController.edit);
voucherRoute.get('/:id',  voucherController.getById);

module.exports = voucherRoute;