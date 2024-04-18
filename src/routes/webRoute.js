const imageController = require('../controllers/imageController');
const upload = require('../middlewares/uploadMiddleware');
const fileUploader = require('../config/cloudinary');

const webRoute = require('express').Router();

webRoute.post('/cloudinary-upload', fileUploader.single('image'), imageController.uploadSingle);
// webRoute.post('/cloudinary-upload-list', fileUploader.array('image', 10), imageController.uploadList);
// webRoute.post('/image/upload', upload.single('image'), imageController.resizeImage, imageController.uploadSingle);
// webRoute.post('/image/upload-list', upload.array('images', 10), imageController.resizeImage, imageController.uploadList);
webRoute.get('/image', imageController.getImages);
webRoute.get('/image/:id', imageController.getImage);

module.exports = webRoute;