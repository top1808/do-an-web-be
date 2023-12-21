const mongoose = require("mongoose");
const { validateEmail } = require("../utils/regex");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    orderCode: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
    },
    customerPhone: {
      type: String,
    },
    customerAddress: {
      type: String,
    },
    customerCode: {
      type: String,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    products: [
      {
        productCode: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        productName: {
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
      },
    ],
    paymentMethod: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: String,
    },
    deliveryFee: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    totalPaid: {
      type: Number,
    },
    totalProductPrice: {
      type: Number,
    },
    voucherCode: {
      type: String,
    },
    voucherDiscount: {
      type: Number,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
