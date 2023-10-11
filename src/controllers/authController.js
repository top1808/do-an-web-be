const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const Role = require("../models/Role");

const authController = {
  //GENERATE TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30s" }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "1d" }
    );
  },
  //REGISTER
  registerUser: async (req, res, next) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      const role = await Role.findOne({ name: "role 1" });

      const newUser = new User({
        ...req.body,
        password: hashed,
        roleId: req.body.roleId ? req.body.roleId : role._id,
      });
      await newUser.save();

      res.status(200).send({ message: "Register successfully." });
    } catch (err) {
      res.status(500).send({ err });
    }
  },
  //LOGIN
  loginUser: async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).send({ message: "Username is wrong." });
      }

      const checkPass = await bcrypt.compare(req.body.password, user.password);
      if (!checkPass) {
        return res.status(404).send({ message: "Password is wrong." });
      }

      const { password, username, ...rest } = user._doc;
      const accessToken = authController.generateAccessToken(user);
      const refreshToken = authController.generateRefreshToken(user);
      const newRefreshToken = new RefreshToken({
        token: refreshToken,
        userId: user._id,
      });
      await newRefreshToken.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      res.status(200).send({ ...rest, accessToken });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  //REFRESH TOKEN
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).send({ message: "You are not authenticated" });

    const checkRefreshToken = await RefreshToken.findOne({
      token: refreshToken,
    });
    if (!checkRefreshToken)
      return res.status(401).send({ message: "You are not authenticated." });

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY,
      async (error, user) => {
        if (error) return res.status(403).send({ error });

        await checkRefreshToken.deleteOne();

        const newAccessToken = authController.generateAccessToken(user);
        const newRefreshToken = authController.generateRefreshToken(user);

        const saveRefreshToken = new RefreshToken({
          token: newRefreshToken,
          userId: user._id,
        });
        await saveRefreshToken.save();

        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
          secure: true,
          sameSite: "strict",
          path: "/",
        });

        res.status(200).send({ accessToken: newAccessToken });
      }
    );
  },

  //LOGOUT
  logout: async (req, res) => {
    const refreshToken = await RefreshToken.findOne({
      token: req.cookies.refreshToken,
    });
    await refreshToken.deleteOne();
    res.cookie("refreshToken", "");

    res.status(200).send({ message: "Logout successfully." });
  },
};

module.exports = authController;
