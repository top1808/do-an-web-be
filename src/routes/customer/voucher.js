const voucherController = require('../../controllers/voucherController');

const voucherRoute = require('express').Router();

voucherRoute.get('/get-list', voucherController.getListVoucher);

module.exports = voucherRoute;