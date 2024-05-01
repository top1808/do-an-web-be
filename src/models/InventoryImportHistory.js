const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventoryImportHistorySchema = new Schema(
  {
    productCode: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productSKUBarcode: {
      type: String,
      required: true,
    },
    quantityImport: {
      type: Number,
    },
    priceImport: {
      type: Number,
    },
  },
  { timestamps: true }
);

inventoryImportHistorySchema.virtual("product", {
  ref: "Product",
  localField: "productCode",
  foreignField: "_id",
});

inventoryImportHistorySchema.virtual("productSKU", {
  ref: "ProductSKU",
  localField: "productSKUBarcode",
  foreignField: "barcode",
});

module.exports = mongoose.model("InventoryImportHistory", inventoryImportHistorySchema);
