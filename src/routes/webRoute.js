const imageController = require('../controllers/imageController');
const upload = require('../middlewares/uploadMiddleware');

const webRoute = require('express').Router();

webRoute.post('/image/upload', upload.single('image'), imageController.uploadSingle);
webRoute.get('/image', imageController.getImages);
webRoute.get('/image/:id', imageController.getImage);

module.exports = webRoute;