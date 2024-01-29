const notificationController = require('../../controllers/notificationController');

const notificationRoute = require('express').Router();

notificationRoute.get('/', notificationController.getCustomerNotifications);
notificationRoute.delete('/:id',  notificationController.delete);

module.exports = notificationRoute;