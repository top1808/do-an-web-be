const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productOrderSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    code: {
      type: String,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    note: {
      type: String,
    },
    options: [
      {
        groupName: {
          type: String,
        },
        option: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

productOrderSchema.virtual("product", {
    ref: "Product",
    localField: "productId",
    foreignField: "_id",
  });
  

module.exports = mongoose.model("ProductOrder", productOrderSchema);
