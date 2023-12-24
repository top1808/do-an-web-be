const Order = require("../models/Order");
const Product = require("../models/Product");
const { generateID } = require("../utils/functionHelper");

const orderController = {
  //getAll
  getAll: async (req, res) => {
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
  delete: async (req, res) => {
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

      res.status(200).send({ order, message: "Create order successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  edit: async (req, res) => {
    try {
      const updateField = req.body;

      const newOrder = await Order.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: updateField,
        }
      );
      res.status(200).send({ newOrder, message: "Update order successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  changeStatus: async (req, res) => {
    try {
      await Order.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: {
            status: req.body.status,
            reasonCancel: req.body?.reason,
          },
        }
      );
      res
        .status(200)
        .send({ id: req.params.id, message: "Change status order successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getById: async (req, res) => {
    try {
      const findOrder = await Order.findById(req.params.id).populate("voucher");

      const order = {
        ...findOrder._doc,
        voucher: findOrder.voucher,
      };

      res.status(200).send({ order });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  /************
   * CUSTOMER *
   ************/
  getMyOrder: async (req, res) => {
    try {
      const customerId = await req.header("userId");

      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;
      const status = query?.status || "all";

      const orders = await Order.find({ customerCode: customerId })
        .skip(offset)
        .limit(limit);
      const total = await Order.find({ customerCode: customerId }).count();

      res.status(200).send({ orders, total, offset, limit });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getMyOrderDetails: async (req, res) => {
    try {
      const customerId = await req.header("userId");

      const order = await Order.findOne({
        _id: req.params.id,
        customerCode: customerId,
      });

      const products = await Product.find();
      const newOrderProducts = [];

      order.products.map((product) => {
        const findProduct = products.find(
          (p) => p._id.toString() === product.productCode.toString()
        );
        if (findProduct) {
          newOrderProducts.push({
            ...product._doc,
            image: findProduct.image,
          });
        }
      });

      res.status(200).send({
        order: {
          ...order._doc,
          products: newOrderProducts,
        },
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = orderController;
