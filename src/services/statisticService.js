const Order = require("../models/Order");

const statisticService = {
  getSaleOfDate: async (date) => {
    const orders = await Order.find({
      receivedDate: date,
      status: "received",
    }).populate("productList");
    let totalAmount = 0;
    let totalQuantity = 0;
    for (let order of orders) {
      for (let product of order["productList"]) {
        totalAmount += Number(product["totalPrice"]);
        totalQuantity += Number(product["quantity"]);
      }
    }
    return {
      totalAmount,
      totalQuantity,
      date,
    };
  },
};

module.exports = statisticService;
