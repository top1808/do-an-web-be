const userController = require('../controllers/userController');
const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();

router.get('/', middlewareController.verifyToken, userController.getAll);
router.delete('/:id', userController.deleteUser);

module.exports = router;