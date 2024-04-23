const Review = require("../models/Review");
const ProductOrder = require("../models/ProductOrder");
const Order = require("../models/Order");

const reviewController = {
  //get
  getAll: async (req, res) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const reviews = await Review.find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      const total = await Review.find().count();

      res.status(200).send({ reviews, total, offset, limit });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //delete
  delete: async (req, res, next) => {
    try {
      const review = await Review.findById(req.params.id);

      await review.deleteOne();

      res.status(200).send({ message: "Delete review successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //view
  getById: async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);

      res.status(200).send({ review });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  /************
   * CUSTOMER *
   ************/

  getProductWithoutReview: async (req, res) => {
    try {
      const customerId = await req.header("userId");

      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const productIds = [];

      const orders = await Order.find({ customerCode: customerId }).select(
        "products"
      );

      orders.forEach((order) => {
        productIds.push(...order.products);
      });

      console.log("🚀 ~ getProductWithoutReview: ~ productIds:", productIds);

      const products = await ProductOrder.find({
        // productCode: { $in: productIds },
      })
        .skip(offset)
        .limit(limit);
      console.log("🚀 ~ getProductWithoutReview: ~ products:", products)

      const total = await ProductOrder.countDocuments({
        productCode: { $in: productIds },
      });

      res.status(200).send({ products, total, offset, limit });
    } catch (err) {
      console.log("🚀 ~ getProductWithoutReview: ~ err:", err);
      res.status(500).send(err);
    }
  },

  getProductReview: async (req, res) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const reviews = await Review.find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      const total = await Review.find().count();

      res.status(200).send({ reviews, total, offset, limit });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getReviewByProduct: async (req, res) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const reviews = await Review.find({
        product: req.params.productId,
      })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      const total = await Review.find().count();

      res.status(200).send({ reviews, total, offset, limit });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  rate: async (req, res) => {
    try {
      const customerId = await req.header("userId");

      const newReview = new Review({ ...req.body, customer: customerId });
      await newReview.save();

      res.status(200).send({ message: "Rate successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = reviewController;
