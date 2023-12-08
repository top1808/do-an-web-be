const express = require('express');
const router = express.Router();

const authRoute = require("../routes/admin/auth");
const roleRoute = require("../routes/admin/role");
const userRoute = require("../routes/admin/user");
const customerRoute = require("../routes/admin/customer");
const categoryRoute = require("../routes/admin/category");
const productRoute = require("../routes/admin/product");
const middlewareController = require("../controllers/middlewareController");
const orderRoute = require('../routes/admin/order');
const voucherRoute = require('../routes/admin/voucher');
const statisticRoute = require('../routes/admin/statistic');

router.use("/auth", authRoute);

router.use(middlewareController.verifyToken);
router.use(middlewareController.checkPermission);

router.use("/authorize", roleRoute);
router.use("/user", userRoute);
router.use("/order", orderRoute);
router.use("/customer", customerRoute);
router.use("/category", categoryRoute);
router.use("/product", productRoute);
router.use("/voucher", voucherRoute);
router.use("/statistic", statisticRoute);

module.exports = router;

