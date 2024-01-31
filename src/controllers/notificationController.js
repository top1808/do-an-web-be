const pusher = require("../config/pusher");
const Notification = require("../models/Notification");
const roleController = require("./roleController");
const firebase = require("firebase-admin");

const notificationController = {
  getData: async (req, res, next) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const currentUser = req.user;

      const data = await Notification.find({
        toUserId: "admin",
        fromUserId: { $ne: currentUser?._id },
      })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .then(async (notifications) => {
          const filteredData = await Promise.all(
            notifications.map(async (notification) => {
              const hasPermission = await roleController.checkPermissionUrl(
                currentUser?._id,
                notification.link
              );
              return hasPermission ? notification : null;
            })
          );
          return filteredData.filter((notification) => notification !== null);
        });

      let totalNew = 0;
      const total = await Notification.find({
        toUserId: "admin",
        fromUserId: { $ne: currentUser?._id },
      }).then(async (notifications) => {
        const filteredData = await Promise.all(
          notifications.map(async (notification) => {
            const hasPermission = await roleController.checkPermissionUrl(
              currentUser?._id,
              notification.link
            );
            return hasPermission ? notification : null;
          })
        );
        totalNew = filteredData.filter(
          (notification) => notification !== null && !notification?.isRead
        )?.length;
        return filteredData.filter((notification) => notification !== null)
          ?.length;
      });

      const pagination = {
        total,
        offset,
        limit,
        page: offset / limit + 1,
        totalNew,
      };

      res.status(200).send({ data, pagination });
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
          fromUser: notification?.fromUserId || "",
          toUser: notification?.toUserId || "admin",
        },
        token: registrationToken,
      };

      if (message?.data?.toUser === "admin") {
        await notificationController.onNotification(message);
      } else {
        await notificationController.onSalesNotification(message);
      }

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
      const checkPermission = roleController.checkPermissionUrl(
        message.data?.fromUser,
        message.data?.link
      );
      if (checkPermission) {
        await pusher.trigger("notifications", "notify", message);
        const response = await firebase.messaging().send(message);
        return response;
      }
      return null;
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

      // const response = await notificationController.onNotification(message);
      await notificationController.onSalesNotification(message);

      res.status(200).send({ response });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // CUSTOMER

  getCustomerNotifications: async (req, res) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 10;

      const customerId = await req.header("userId");

      const data = await Notification.find({
        $or: [{ toUserId: customerId }, { toUserId: "all_customer" }],
        fromUserId: { $ne: customerId },
      })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

      const total = await Notification.find({
        $or: [{ toUserId: customerId }, { toUserId: "all_customer" }],
        fromUserId: { $ne: customerId },
      }).count();

      const totalNew = await Notification.find({
        $or: [{ toUserId: customerId }, { toUserId: "all_customer" }],
        fromUserId: { $ne: customerId },
        isRead: { $ne: true },
      }).count();

      const pagination = {
        total,
        offset,
        limit,
        page: offset / limit + 1,
        totalNew,
      };

      res.status(200).send({ data, pagination });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  onSalesNotification: async (message) => {
    try {
      await pusher.trigger("notifications", "sales_notify", message);
      const response = await firebase.messaging().send(message);
      return response;
    } catch (err) {
      return err;
    }
  },
};

module.exports = notificationController;
