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
    productOrderId: {
      type: Schema.Types.ObjectId,
      ref: "ProductOrder",
    },
    customerId: {
      type: String,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    productSKU: {
      type: Schema.Types.ObjectId,
      ref: "ProductSKU",
    },
    orderCode: {
      type: String,
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

reviewSchema.virtual("orderDetail", {
  ref: "Order",
  localField: "orderCode",
  foreignField: "orderCode",
});

reviewSchema.virtual("productOrderDetail", {
  ref: "ProductOrder",
  localField: "productOrderId",
  foreignField: "_id",
});

reviewSchema.virtual("customer", {
  ref: "Customer",
  localField: "customerId",
  foreignField: "id",
});

module.exports = mongoose.model("Review", reviewSchema);
