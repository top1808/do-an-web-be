const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const { generateID } = require("../utils/functionHelper");

const customerController = {
  //getAll
  getAll: async (req, res, next) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const customers = await Customer.find().skip(offset).limit(limit);
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

      await customer.deleteOne();
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

      const newCustomer = await Customer.updateOne(
        {
          id: req.params.id,
        },
        {
          $set: updateField,
        }
      );
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
      const { password, ...rest } = customer._doc;

      res.status(200).send({ customer: rest });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = customerController;
