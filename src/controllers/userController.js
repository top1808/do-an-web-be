const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const userController = {
  //getAllUser
  getAll: async (req, res, next) => {
    try {
      const users = await User.find();
      res.status(200).send({ users });
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

      res.status(200).send({ user, message: "Create user successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(200).send({ user });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = userController;
