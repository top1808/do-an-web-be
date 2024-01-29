const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    image: {
      type: String,
    },
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    link: {
      type: String,
    },
    fromUserId: {
      type: String,
    },
    toUserId: {
      type: String,
    },
    isRead: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
