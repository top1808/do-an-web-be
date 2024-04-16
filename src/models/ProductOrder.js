const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productOrderSchema = new Schema(
  {
    orderCode: {
      type: String,
    },
    productCode: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    productName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    productSKUBarcode: {
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
  localField: "productCode",
  foreignField: "_id",
});

productOrderSchema.virtual("order", {
  ref: "Order",
  localField: "orderCode",
  foreignField: "orderCode",
  justOne: true,
});

module.exports = mongoose.model("ProductOrder", productOrderSchema);
