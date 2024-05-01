const express = require('express');
const categoryRoute = require('../routes/customer/category');
const productRoute = require('../routes/customer/product');
const cartRoute = require('../routes/customer/cart');
const authRoute = require('../routes/customer/auth');
const customerRoute = require('../routes/customer/customer');
const voucherRoute = require('../routes/customer/voucher');
const orderRoute = require('../routes/customer/order');
const discountProgramRoute = require('../routes/customer/discountProgram');
const notificationRoute = require('../routes/customer/notification');
const reviewRoute = require('../routes/customer/review');
const customerController = require('../controllers/customerController');
const router = express.Router();

router.use("/auth", authRoute);
router.get('/customer/:id', customerController.getById);
// router.use("/customer", customerRoute);
router.use("/notification", notificationRoute);
router.use("/category", categoryRoute);
router.use("/product", productRoute);
router.use("/cart", cartRoute);
router.use("/voucher", voucherRoute);
router.use("/discount-program", discountProgramRoute);
router.use("/order", orderRoute);
router.use("/review", reviewRoute);

module.exports = router;