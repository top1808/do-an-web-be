const authController = require('../../controllers/authController');
const middlewareController = require('../../controllers/middlewareController');

const authRoute = require('express').Router();

authRoute.post('/register', authController.registerUser);
authRoute.post('/login', authController.loginUser);
authRoute.post('/refresh', authController.requestRefreshToken);
authRoute.post('/logout', middlewareController.verifyToken, authController.logout);

module.exports = authRoute;