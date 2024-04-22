const reviewController = require('../../controllers/reviewController');

const reviewRoute = require('express').Router();

reviewRoute.post('/rate', reviewController.rate);
reviewRoute.get('/get-product-without-review', reviewController.getProductWithoutReview);
reviewRoute.get('/get-product-review', reviewController.getProductReview);
reviewRoute.get('/get-by-product/:productId',  reviewController.getReviewByProduct);

module.exports = reviewRoute;