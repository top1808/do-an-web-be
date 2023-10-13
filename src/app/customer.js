const express = require('express');
const categoryRoute = require('../routes/customer/category');
const productRoute = require('../routes/customer/product');
const cartRoute = require('../routes/customer/cart');
const authRoute = require('../routes/customer/auth');
const customerRoute = require('../routes/customer/customer');
const router = express.Router();

router.use("/auth", authRoute);
router.use("/customer", customerRoute);
router.use("/category", categoryRoute);
router.use("/product", productRoute);
router.use("/cart", cartRoute);

module.exports = router;