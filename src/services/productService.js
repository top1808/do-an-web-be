const Product = require("../models/Product");
const ProductDiscount = require("../models/ProductDiscount");
const ProductOrder = require("../models/ProductOrder");
const Review = require("../models/Review");
const inventoryService = require("./inventoryService");

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

  async getTotalReview(id) {
    const result = await Review.aggregate([
      {
        $match: {
          product: id,
        },
      },
      {
        $group: {
          _id: "$product",
          totalReview: { $sum: 1 },
        },
      },
    ]);
    return result[0]?.totalReview || 0;
  },

  async getProducts(query, skip = 0, limit = 20, sort = { createdAt: -1 }) {
    return await Product.find(query)
      .sort(sort)
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
            const totalReviews = await productService.getTotalReview(item._id);

            let soldQuantityOfProduct = 0;
            for (let productSKUBarcode of item["productSKUBarcodes"]) {
              const inventory = await inventoryService.getProductInventory({
                productCode: item._id,
                productSKUBarcode: productSKUBarcode,
              });
              soldQuantityOfProduct += Number(inventory["soldQuantity"]) || 0;
            }
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
                soldQuantityOfProduct,
                totalReviews,
              };
            }
            return { ...item._doc, rate, soldQuantityOfProduct, totalReviews };
          })
        );
      });
  },

  async getSoldProduct() {
    return await ProductOrder.find()
      .populate("order")
      .then((data) => {
        return data.map((item) => {
          return item._doc;
        });
      });
  },
};

module.exports = productService;
