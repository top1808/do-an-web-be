const authController = require('../../controllers/authController');
const middlewareController = require('../../controllers/middlewareController');

const authRoute = require('express').Router();

authRoute.post('/register', authController.registerCustomer);
authRoute.post('/login', authController.loginCustomer);
authRoute.post('/logout', authController.logoutCustomer);

module.exports = authRoute;