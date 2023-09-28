const categoryController = require('../controllers/categoryController');
const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();

router.get('/', categoryController.getAll);
router.post('/create', categoryController.create);
router.delete('/:id',  categoryController.delete);

module.exports = router;