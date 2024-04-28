const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    productCode: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productSKUBarcode: {
      type: Schema.Types.ObjectId,
      ref: "ProductSKU",
      required: true,
    },
    quantity: {
      type: Number,
    },
  },
  { timestamps: true }
);

inventorySchema.virtual("product", {
  ref: "Product",
  localField: "productCode",
  foreignField: "_id",
});

inventorySchema.virtual("productSKU", {
  ref: "ProductSKU",
  localField: "productSKUBarcode",
  foreignField: "barcode",
});

module.exports = mongoose.model("Inventory", inventorySchema);
