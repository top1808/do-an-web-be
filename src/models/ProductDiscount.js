const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productDiscountSchema = new Schema(
  {
    discountProgramCode: {
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
    type: {
      type: String,
    },
    value: {
      type: Number,
    },
    promotionPrice: {
      type: Number,
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

productDiscountSchema.virtual("product", {
  ref: "Product",
  localField: "productCode",
  foreignField: "_id",
});

productDiscountSchema.virtual("discountProgram", {
  ref: "DiscountProgram",
  localField: "discountProgramCode",
  foreignField: "discountProgramCode",
  justOne: true,
});

module.exports = mongoose.model("ProductDiscount", productDiscountSchema);
