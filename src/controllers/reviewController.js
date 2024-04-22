const Review = require("../models/Review");

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
      const reviews = req.body.reviews || [];
      await Promise.all(
        reviews?.forEach(async (review) => {
          const newReview = new Review(review);
          const review = await newReview.save();
        })
      );

      res.status(200).send({ message: "Rate successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = reviewController;
