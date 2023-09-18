const userController = require('../controllers/userController');

const router = require('express').Router();

router.get('/', userController.getAll);
router.delete('/:id', userController.deleteUser);

module.exports = router;