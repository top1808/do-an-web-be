const roleController = require('../controllers/roleController');

const roleRoute = require('express').Router();

roleRoute.get('/permission', roleController.getPermission);
roleRoute.post('/permission/create', roleController.createPermission);

roleRoute.get('/role', roleController.getRole);
roleRoute.post('/role/create', roleController.createRole);
roleRoute.post('/role/give-permission', roleController.givePermissionForRole);

module.exports = roleRoute;