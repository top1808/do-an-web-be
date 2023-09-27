const userController = require('../controllers/userController');
const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();

router.get('/', middlewareController.verifyToken, userController.getAll);
router.post('/create', middlewareController.verifyToken, userController.createUser);
router.delete('/:id',  middlewareController.verifyToken, userController.deleteUser);

module.exports = router;