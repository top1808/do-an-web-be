const voucherController = require('../../controllers/voucherController');

const voucherRoute = require('express').Router();

voucherRoute.get('/get-list', voucherController.getListVoucher);
voucherRoute.post('/apply-voucher', voucherController.applyVoucher);

module.exports = voucherRoute;