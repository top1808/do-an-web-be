const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const discountProgramSchema = new Schema(
  {
    discountProgramCode: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductDiscount",
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

discountProgramSchema.virtual("productList", {
  ref: "ProductDiscount",
  localField: "products",
  foreignField: "_id",
});

module.exports = mongoose.model("DiscountProgram", discountProgramSchema);
