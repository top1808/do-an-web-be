const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const Role = require("../models/Role");
const Customer = require("../models/Customer");
const { generateID, formatDateTimeString } = require("../utils/functionHelper");
const authService = require("../services/authService");
const { sendEmail } = require("../config/nodemailer");
const VerifyLoginEmailTemplate = require("../templates/email/VerifyLoginEmail.template");

const authController = {
  //GENERATE TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        _id: user._id,
        name: user?.name,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1d" }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        _id: user._id,
        name: user?.name,
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
        sameSite: "none",
        path: "/",
      });

      await User.updateOne(
        {
          username: req.body.username,
        },
        {
          $set: { lastLogin: formatDateTimeString() },
        }
      );

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
          sameSite: "none",
          path: "/",
          domain: process.env.NODE_ENV === 'development' ? '.localhost' : '.vercel.app'
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

  /**************
   * CUSTOMER *
   **************/
  registerCustomer: async (req, res) => {
    try {
      const findCustomer = await Customer.findOne({ email: req.body?.email });

      if (findCustomer)
        return res.status(404).send({ message: "Email is exist." });

      const password = req.body?.password ? req.body.password : generateID();
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const newCustomer = new Customer({
        ...req.body,
        name: req.body?.name || "No name",
        password: hashed,
        id: req.body?.id ? req.body.id : generateID(),
        isVerified: !!req.body?.id
      });
      await newCustomer.save();

      const verificationUrl = await authService.createVerifyEmailUrl(newCustomer);

      const emailContent = VerifyLoginEmailTemplate({
        url: verificationUrl,
      });

      await sendEmail({
        to: newCustomer, subject: "Xác thực tài khoản email", html: emailContent
      });

      res.status(200).send({ message: "Please check your email to verify your account." });
    } catch (err) {
      res.status(500).send({ err });
    }
  },

  loginCustomer: async (req, res) => {
    try {
      const customer = await Customer.findOne({ email: req.body.email });
      if (!customer) {
        return res.status(404).send({ message: "EmailNotFound" });
      }

      const checkPass = await bcrypt.compare(
        req.body.password,
        customer.password
      );
      if (!checkPass) {
        return res.status(404).send({ message: "PasswordWrong" });
      }

      if (!customer?.isVerified) {
        return res.status(404).send({ message: "EmailNotVerified" });
      }

      const { password, username, ...rest } = customer._doc;
      const accessToken = authController.generateAccessToken(customer);

      res.status(200).send({ ...rest, accessToken });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  logoutCustomer: async (req, res) => {
    res.cookie("refreshTokenUser", "");
    res.status(200).send({ message: "Logout successfully." });
  },

  changePassword: async (req, res) => {
    try {
      const customerId = await req.header("userId");

      const customer = await Customer.findOne({ id: customerId });
      if (!customer)
        return res.status(404).send({ message: "Customer not found." });

      const { password } = customer._doc;

      const checkPass = await bcrypt.compare(req.body.password, password);

      if (!checkPass) {
        return res.status(404).send({ message: "Password is wrong." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.newPassword, salt);

      await customer.updateOne({ password: hashed });

      res.status(200).send({ message: "Change password successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  changeInfor: async (req, res) => {
    try {
      const customerId = await req.header("userId");

      const updateField = req.body;

      const data = await Customer.findOneAndUpdate(
        { id: customerId },
        {
          $set: updateField,
        },
        { new: true }
      );

      res
        .status(200)
        .send({ data, message: "Change information successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  verifyTokenEmail: async (req, res) => {
    try {
      const token = req.params.token;
      const checkToken = await authService.checkToken(token);

      if (!checkToken) {
        return res.status(400).send({ message: "Invalid token." });
      }

      await Customer.updateOne({ email: checkToken.email }, { isVerified: true });

      res
        .status(200)
        .send({ message: "Verify Token successfully." });
    } catch (err) {
      res.status(500).send(err);
    }

  },
};

module.exports = authController;
