const express = require('express');
const router = express.Router();

const authRoute = require("../routes/admin/auth");
const roleRoute = require("../routes/admin/role");
const userRoute = require("../routes/admin/user");
const categoryRoute = require("../routes/admin/category");
const productRoute = require("../routes/admin/product");
const middlewareController = require("../controllers/middlewareController");

router.use("/auth", authRoute);

router.use(middlewareController.verifyToken);
router.use(middlewareController.checkPermission);

router.use("/authorize", roleRoute);
router.use("/user", userRoute);
router.use("/category", categoryRoute);
router.use("/product", productRoute);

module.exports = router;
