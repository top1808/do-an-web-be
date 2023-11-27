const cartController = require('../../controllers/cartController');

const cartRoute = require('express').Router();

cartRoute.get('/', cartController.getCart);
cartRoute.post('/add-to-cart', cartController.addToCart);
cartRoute.delete('/:id', cartController.deleteCartItem);

module.exports = cartRoute;