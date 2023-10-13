const Customer = require("../models/Customer");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcrypt");

const customerController = {
  //getAllUser
  getAll: async (req, res, next) => {
    try {
      const customers = await Customer.find();
      res.status(200).send({ customers });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //delete
  delete: async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);

      await customer.deleteOne();
      res.status(200).send({ message: "Delete customer successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //createUser
  create: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newCustomer = new Customer({
        ...req.body,
        password: hashed,
      });

      const customer = await newCustomer.save();

      res.status(200).send({ customer, message: "Create user successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getById: async (req, res) => {
    try {
      const customer = await Customer.findOne({ id: req.params.id });
      res.status(200).send({ customer });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = customerController;
