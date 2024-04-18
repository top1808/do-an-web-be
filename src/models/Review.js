const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    content: {
      type: String,
    },
    rate: {
      type: Number,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    images: [{
      type: String
    }],
    isAnonymous: {
      type: Boolean
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
