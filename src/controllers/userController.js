const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const notificationController = require("./notificationController");

const userController = {
  //getAllUser
  getAll: async (req, res, next) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const users = await User.find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      const total = await User.find().count();

      res.status(200).send({ users, total, offset, limit });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //deleteUser
  deleteUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      const refreshToken = await RefreshToken.findOne({
        userId: user._id,
      });
      if (refreshToken) await refreshToken.deleteOne();

      await user.deleteOne();

      const notification = {
        title: "Delete notification",
        body: (req.user?.name || "No name") + " deleted user " + user["name"],
        image: "",
        link: "/user",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ message: "Delete user successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //createUser
  createUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        ...req.body,
        password: hashed,
      });

      const user = await newUser.save();

      const notification = {
        title: "Create notification",
        body:
          (req.user?.name || "No name") + " created user " + newUser["name"],
        image: "",
        link: "/user",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ user, message: "Create user successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      const { password, ...rest } = user._doc;

      res.status(200).send({ user: rest });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  editUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      let hashed = "";
      if (req.body.password) {
        hashed = await bcrypt.hash(req.body.password, salt);
      }

      const updateField = { ...req.body, password: hashed };
      if (!hashed) delete updateField.password;

      const newUser = await User.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: updateField,
        }
      );

      const notification = {
        title: "Edit notification",
        body:
          (req.user?.name || "No name") + " editted user " + newUser["name"],
        image: "",
        link: "/user",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ newUser, message: "Update user successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  changePassword: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send({ message: "User not found." });

      const { password, ...rest } = user._doc;

      const checkPass = await bcrypt.compare(req.body.password, password);

      if (!checkPass) {
        return res.status(404).send({ message: "Password is wrong." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.newPassword, salt);

      await user.updateOne({ password: hashed });

      const notification = {
        title: "Change password notification",
        body:
          (req.user?.name || "No name") +
          " changed password user " +
          user["name"],
        image: "",
        link: "/user",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ message: "Change password successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = userController;
