const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const { generateID } = require("../utils/functionHelper");
const notificationController = require("./notificationController");
const Order = require("../models/Order");

const customerController = {
  //getAll
  getAll: async (req, res, next) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const customers = await Customer.find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      const total = await Customer.find().count();

      res.status(200).send({ customers, total, offset, limit });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //delete
  delete: async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      const ordersOfCustomer = await Order.find({
        customerCode: customer?.id,
        status: { $nin: ["received", "canceled"] },
      });

      if (ordersOfCustomer?.length > 0) {
        return res.status(409).send({ message: "The customer has an order." });
      }

      await customer.deleteOne();

      const notification = {
        title: "Delete notification",
        body:
          (req.user?.name || "No name") +
          " deleted customer " +
          customer["name"],
        image: customer["image"] || "",
        link: "/customer",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ message: "Delete customer successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //create
  create: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newCustomer = new Customer({
        ...req.body,
        password: hashed,
        id: generateID(),
      });

      const customer = await newCustomer.save();

      const notification = {
        title: "Create notification",
        body:
          (req.user?.name || "No name") +
          " created customer " +
          newCustomer["name"],
        image: newCustomer["image"] || "",
        link: "/customer",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res
        .status(200)
        .send({ customer, message: "Create customer successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  edit: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      let hashed = "";
      if (req.body.password) {
        hashed = await bcrypt.hash(req.body.password, salt);
      }

      const updateField = { ...req.body, password: hashed };
      if (!hashed) delete updateField.password;

      const newCustomer = await Customer.findOneAndUpdate(
        {
          id: req.params.id,
        },
        {
          $set: updateField,
        }
      );

      const notification = {
        title: "Edit notification",
        body:
          (req.user?.name || "No name") +
          " edited customer " +
          newCustomer["name"],
        image: newCustomer["image"] || "",
        link: "/customer",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res
        .status(200)
        .send({ newCustomer, message: "Update customer successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getById: async (req, res) => {
    try {
      const customer = await Customer.findOne({ id: req.params.id });
      if (customer) {
        const { password, ...rest } = customer._doc;
        res.status(200).send({ customer: rest });
      } else {
        res.status(200).send({ customer: null });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = customerController;
