const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSKUSchema = new Schema(
  {
    barcode: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    option1: {
      type: String,
    },
    option2: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

ProductSKUSchema.virtual("productDetail", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
});

module.exports = mongoose.model("ProductSKU", ProductSKUSchema);
