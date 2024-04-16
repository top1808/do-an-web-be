const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
    },
    minPrice: {
      type: Number,
    },
    maxPrice: {
      type: Number,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: true,
    },
    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    groupOptions: [
      {
        groupName: {
          type: String,
        },
        options: [{ type: String }],
      },
    ],
    productSKUBarcodes: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

productSchema.virtual("categoryList", {
  ref: "Category",
  localField: "categoryIds",
  foreignField: "_id",
});

productSchema.virtual("productSKUDetails", {
  ref: "ProductSKU",
  localField: "productSKUBarcodes",
  foreignField: "barcode",
});

module.exports = mongoose.model("Product", productSchema);
