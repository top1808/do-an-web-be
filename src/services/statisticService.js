const Order = require("../models/Order");
const ProductOrder = require("../models/ProductOrder");

const statisticService = {
  getAmountSaleOfDay: async (day) => {
    const startDate = day + "T00:00:00.000Z";
    const endDate = day + "T23:59:59.999Z";
    const orders = await Order.find({
      receivedDate: {
        $gte: startDate,
        $lt: endDate,
      },
      status: "received",
    }).populate("productList");

    for (let order of orders) {
      for (let product of order["productList"]) {
        console.log("🚀 ~ getAmountSaleOfDay: ~ product:", product);
      }
    }
  },
};

module.exports = statisticService;
