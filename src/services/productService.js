const Product = require("../models/Product");
const ProductDiscount = require("../models/ProductDiscount");
const ProductOrder = require("../models/ProductOrder");
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

  async getProducts(query, skip = 0, limit = 20) {
    return await Product.find(query)
      .skip(skip)
      .limit(limit)
      .then(async (data) => {
        return await Promise.all(
          data.map(async (item) => {
            const productDiscounts = await ProductDiscount.find({
              productCode: item._id,
              status: true,
            }).populate("discountProgram");
            const rate = await productService.getAvarateRate(item._id);
            if (productDiscounts?.length > 0) {
              let minPromotionPrice = item._doc.minPrice;
              let maxPromotionPrice = item._doc.maxPrice;
              const discounts = productDiscounts?.map((elm) => {
                if (elm._doc.promotionPrice < minPromotionPrice)
                  minPromotionPrice = elm._doc.promotionPrice;
                if (
                  elm._doc.price === item._doc.maxPrice &&
                  elm._doc.promotionPrice < maxPromotionPrice
                )
                  maxPromotionPrice = elm._doc.promotionPrice;
                return {
                  ...elm._doc,
                  discountProgram: elm["discountProgram"],
                };
              });
              return {
                ...item._doc,
                minPromotionPrice,
                maxPromotionPrice,
                discounts,
                rate,
              };
            }
            return item;
          })
        );
      });
  },

  async getSoldProduct() {
    return await ProductOrder.find().populate("order")
    .then(data => {
      return data.map(item => {
        return item._doc;
      })
    })
  },

};

module.exports = productService;
