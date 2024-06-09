const authController = require('../../controllers/authController');

const authRoute = require('express').Router();

authRoute.post('/register', authController.registerCustomer);
authRoute.get('/verify-email/:token', authController.verifyTokenEmail);
authRoute.post('/login', authController.loginCustomer);
authRoute.post('/logout', authController.logoutCustomer);
authRoute.post('/change-password', authController.changePassword);
authRoute.post('/change-infor', authController.changeInfor);

module.exports = authRoute;