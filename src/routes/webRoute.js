const imageController = require('../controllers/imageController');
const upload = require('../middlewares/uploadMiddleware');

const webRoute = require('express').Router();

webRoute.post('/image/upload', upload.single('image'), imageController.uploadSingle);
webRoute.post('/image/upload-list', upload.array('images', 10), imageController.uploadList);
webRoute.get('/image', imageController.getImages);
webRoute.get('/image/:id', imageController.getImage);

module.exports = webRoute;