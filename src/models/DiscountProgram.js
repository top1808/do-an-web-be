const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const discountProgramSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    products: [
      {
        productCode: {
          type: Schema.Types.ObjectId,
          ref: "Product",
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
      },
    ],
    description: {
      type: String,
    },
    dateStart: {
      type: String,
      required: true,
    },
    dateEnd: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiscountProgram", discountProgramSchema);
