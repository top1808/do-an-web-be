const productController = require('../controllers/productController');
const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();

router.get('/', productController.getAll);
router.post('/create', productController.create);
router.delete('/:id',  productController.delete);

module.exports = router;