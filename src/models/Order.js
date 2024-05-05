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
        type: Schema.Types.ObjectId,
        ref: "ProductOrder",
      },
    ],
    paymentMethod: {
      type: String,
      required: true,
    },
    customerProvince: {
      value: {
        type: Number,
      },
      label: {
        type: String,
      },
    },
    customerDistrict: {
      value: {
        type: Number,
      },
      label: {
        type: String,
      },
    },
    customerWard: {
      value: {
        type: Number,
      },
      label: {
        type: String,
      },
    },
    deliveryAddress: {
      type: String,
    },
    deliveryDate: {
      type: String,
    },
    receivedDate: {
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
    reasonCancel: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

orderSchema.virtual("voucher", {
  ref: "Voucher",
  localField: "voucherCode",
  foreignField: "code",
  justOne: true,
});

orderSchema.virtual("productList", {
  ref: "ProductOrder",
  localField: "products",
  foreignField: "_id",
});

module.exports = mongoose.model("Order", orderSchema);
