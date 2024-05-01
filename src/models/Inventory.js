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
      type: String,
      required: true,
      unique: true,
    },
    originalQuantity: {
      type: Number,
      min: 0,
    },
    soldQuantity: {
      type: Number,
      min: 0,
    },
    currentQuantity: {
      type: Number,
      min: 0,
    },
    historyImportId: [
      {
        type: Schema.Types.ObjectId,
        ref: "InventoryImportHistory",
      },
    ],
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

inventorySchema.virtual("historyImport", {
  ref: "InventoryImportHistory",
  localField: "historyImportId",
  foreignField: "_id",
});

module.exports = mongoose.model("Inventory", inventorySchema);
