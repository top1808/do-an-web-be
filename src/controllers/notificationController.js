const pusher = require("../config/pusher");
const Notification = require("../models/Notification");
const firebase = require("firebase-admin");

const notificationController = {
  getData: async (req, res, next) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const customerId = req.header("userId") || "admin";

      const data = await Notification.find({ toUserId: customerId })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      const total = await Notification.find().count();

      res.status(200).send({ data, total, offset, limit });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //delete
  delete: async (req, res, next) => {
    try {
      const Notification = await Notification.findById(req.params.id);

      await Notification.deleteOne();
      res.status(200).send({ message: "Xóa Notification thành công." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //create
  create: async (req, notification) => {
    try {
      const newNotification = new Notification(notification);
      await newNotification.save();

      const registrationToken = req.header("messagingToken");
      const message = {
        notification: {
          title: notification?.title,
          body: notification?.body,
        },
        data: {
          link: notification?.link,
          image: notification?.image,
          fromUser: req.user?._id || "",
          toUser: notification?.toUserId || "admin",
        },
        token: registrationToken,
      };

      await notificationController.onNotification(message);

      return notification;
    } catch (err) {
      return err;
    }
  },
  //read
  read: async (req, res) => {
    try {
      await Notification.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: { isRead: true },
        }
      );
      res.status(200).send({ message: "Read notification." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  onNotification: async (message) => {
    try {
      await pusher.trigger("notifications", "notify", message);
      const response = await firebase.messaging().send(message);
      return response;
    } catch (err) {
      return err;
    }
  },

  pushNotification: async (req, res) => {
    try {
      const registrationToken = req.header("messagingToken");
      const message = {
        notification: {
          title: "Notification Title",
          body: "Notification Body",
        },
        token: registrationToken,
      };

      const response = await notificationController.onNotification(message);

      res.status(200).send({ response });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = notificationController;
