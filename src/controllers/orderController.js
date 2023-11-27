const Order = require("../models/Order");
const { generateID } = require("../utils/functionHelper");

const orderController = {
  //getAll
  getAll: async (req, res, next) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const orders = await Order.find().skip(offset).limit(limit);
      const total = await Order.find().count();

      res.status(200).send({ orders, total, offset, limit });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //delete
  delete: async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      await order.deleteOne();
      res.status(200).send({ message: "Delete order successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //create
  create: async (req, res) => {
    try {
      const newOrder = new Order({
        ...req.body,
        orderCode: req.body?.orderCode || generateID(),
      });

      const order = await newOrder.save();

      res
        .status(200)
        .send({ order, message: "Create order successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  edit: async (req, res) => {
    try {

      const updateField = req.body

      const newOrder = await Order.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: updateField,
        }
      );
      res
        .status(200)
        .send({ newOrder, message: "Update order successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getById: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      res.status(200).send({ order });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = orderController;
