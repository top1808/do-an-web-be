const notificationController = require('../../controllers/notificationController');

const notificationRoute = require('express').Router();

notificationRoute.get('/', notificationController.getData);
notificationRoute.delete('/:id',  notificationController.delete);
notificationRoute.post('/push-notification',  notificationController.pushNotification);
notificationRoute.put('/read/:id', notificationController.read);

module.exports = notificationRoute;