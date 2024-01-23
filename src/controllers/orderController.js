const Order = require("../models/Order");
const Product = require("../models/Product");
const { generateID } = require("../utils/functionHelper");
const notificationController = require("./notificationController");

const orderController = {
  //getAll
  getAll: async (req, res) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
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

      const notification = {
        title: "Delete notification",
        body: (req.user?.name || "No name") + " deleted order " + order["orderCode"],
        image: "",
        link: "/order",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);
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

      const notification = {
        title: "Create notification",
        body: (req.user?.name || "No name") + " created order " + newOrder["orderCode"],
        image: "",
        link: "/order",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ order, message: "Create order successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  edit: async (req, res) => {
    try {
      const updateField = req.body;

      const newOrder = await Order.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: updateField,
        }
      );

      const notification = {
        title: "Edit notification",
        body: (req.user?.name || "No name") + " editted order " + newOrder["orderCode"],
        image: "",
        link: "/order",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ newOrder, message: "Update order successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  changeStatus: async (req, res) => {
    try {
      const updateFields = {
        status: req.body.status,
        deliveryAddress: req.body?.deliveryAddress || "",
        deliveryDate: req.body?.deliveryDate || "",
        receivedDate: req.body?.receivedDate || "",
        reasonCancel: req.body?.reason || "",
      };

      for (const key in updateFields) {
        if (!updateFields[key]) delete updateFields[key];
      }

      await Order.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: updateFields,
        }
      );
      res.status(200).send({
        id: req.params.id,
        message: "Change status order successful.",
      });
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
        .limit(limit)
        .sort({ createdAt: -1 });
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

      const newOrderProducts = await Promise.all(
        order.products.map(async (product) => {
          const findProduct = await Product.findById(product.productCode);

          if (findProduct) {
            return {
              ...product._doc,
              image: findProduct._doc.image,
            };
          }
        })
      );

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
