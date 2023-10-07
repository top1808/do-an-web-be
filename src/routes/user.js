const userController = require('../controllers/userController');

const userRoute = require('express').Router();

userRoute.get('/', userController.getAll);
userRoute.post('/create', userController.createUser);
userRoute.delete('/:id',  userController.deleteUser);

module.exports = userRoute;