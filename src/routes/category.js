const categoryController = require('../controllers/categoryController');
const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();

router.get('/', middlewareController.verifyToken, categoryController.getAll);
router.post('/create', middlewareController.verifyToken, categoryController.create);
router.delete('/:id',  middlewareController.verifyToken, categoryController.delete);

module.exports = router;