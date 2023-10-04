const roleController = require('../controllers/roleController');
// const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();

router.get('/permission', roleController.getPermission);
router.post('/permission/create', roleController.createPermission);
router.get('/role', roleController.getRole);
router.post('/role/create', roleController.createRole);
router.put('/role/give-permission/:id', roleController.givePermissionForRole);

module.exports = router;