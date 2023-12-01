const cartController = require('../../controllers/cartController');

const cartRoute = require('express').Router();

cartRoute.get('/', cartController.getCart);
cartRoute.post('/add-to-cart', cartController.addToCart);
cartRoute.put('/:id', cartController.editCartItem);
cartRoute.delete('/:id', cartController.deleteCartItem);

module.exports = cartRoute;