const Review = require("../models/Review");

const productService = {
  async getAvarateRate(id) {
    const result = await Review.aggregate([
      {
        $match: {
          product: id,
        },
      },
      {
        $group: {
          _id: "$product",
          averageRate: { $avg: "$rate" },
        },
      },
    ]);
    return result[0]?.averageRate || 0;
  },
};

module.exports = productService;
