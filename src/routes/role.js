const middlewareController = require('../controllers/middlewareController');
const roleController = require('../controllers/roleController');

const roleRoute = require('express').Router();

roleRoute.get('/permission', roleController.getPermission);
roleRoute.post('/permission/create', roleController.createPermission);
roleRoute.post('/permission/check', roleController.checkPermisson);

roleRoute.get('/role', roleController.getRole);
roleRoute.post('/role/create', roleController.createRole);
roleRoute.post('/role/give-permission', middlewareController.checkPermission, roleController.givePermissionForRole);

module.exports = roleRoute;