const Category = require("../models/Category");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Product = require("../models/Product");
const notificationController = require("./notificationController");

const statisticController = {
  getStatistic: async (req, res) => {
    try {
      const productQuantity = await Product.find().count();
      const categoryQuantity = await Category.find().count();
      const orderQuantity = await Order.find().count();
      const customerQuantity = await Customer.find().count();

      const data = {
        productQuantity,
        categoryQuantity,
        orderQuantity,
        customerQuantity,
      };

      res.status(200).send({ data });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = statisticController;
