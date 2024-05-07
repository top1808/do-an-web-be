const dayjs = require("dayjs");
const Category = require("../models/Category");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Product = require("../models/Product");
const statisticService = require("../services/statisticService");
const { getListDateFromStartToEnd } = require("../utils/functionHelper");

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

  getSaleOfRange: async (req, res) => {
    try {
      const query = req.query;
      const startDate = query?.startDate
        ? dayjs(query.startDate).format("YYYY-MM-DD")
        : "";
      const endDate = query?.endDate
        ? dayjs(query.endDate).format("YYYY-MM-DD")
        : "";
      const dates = getListDateFromStartToEnd(startDate, endDate);
      let data = [];
      for (let date of dates) {
        const saleOfDay = await statisticService.getSaleOfDate(
          dayjs(date).format("YYYY-MM-DD")
        );
        data.push(saleOfDay);
        console.log("🚀 ~ getSaleOfRange: ~ saleOfDay:", saleOfDay);
      }
      res.status(200).send({ data });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = statisticController;
