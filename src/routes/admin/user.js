const userController = require('../../controllers/userController');

const userRoute = require('express').Router();

userRoute.get('/', userController.getAll);
userRoute.post('/create', userController.createUser);
userRoute.delete('/:id',  userController.deleteUser);
userRoute.get('/:id',  userController.getUser);
userRoute.put('/update/:id',  userController.editUser);
userRoute.put('/change-password/:id',  userController.changePassword);

module.exports = userRoute;