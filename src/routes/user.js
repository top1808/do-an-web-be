const userController = require('../controllers/userController');
const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();

router.get('/', userController.getAll);
router.post('/create', userController.createUser);
router.delete('/:id',  userController.deleteUser);

module.exports = router;