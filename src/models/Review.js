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
    productSKU: {
      type: Schema.Types.ObjectId,
      ref: "ProductSKU",
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

reviewSchema.virtual("productDetail", {
  ref: "Product",
  localField: "product",
  foreignField: "_id",
});

reviewSchema.virtual("productSKUDetail", {
  ref: "ProductSKU",
  localField: "productSKU",
  foreignField: "_id",
});

module.exports = mongoose.model("Review", reviewSchema);
