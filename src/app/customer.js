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
const router = express.Router();

router.use("/auth", authRoute);
router.use("/customer", customerRoute);
router.use("/notification", notificationRoute);
router.use("/category", categoryRoute);
router.use("/product", productRoute);
router.use("/cart", cartRoute);
router.use("/voucher", voucherRoute);
router.use("/discount-program", discountProgramRoute);
router.use("/order", orderRoute);

module.exports = router;