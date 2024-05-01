const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Inventory = require("./Inventory"); // Import Inventory Model

const ProductSKUSchema = new Schema(
  {
    barcode: {
      type: String,
      required: true,
    },
    image: {
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
    price: {
      type: Number,
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

ProductSKUSchema.virtual("productDetail", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
});

ProductSKUSchema.pre("save", async function (next) {
  const productSKU = this;
  await Inventory.findOne({ productSKUBarcode: productSKU.barcode })
    .then(async (inventory) => {
      if (inventory) {
        if (productSKU.isModified("productId") || productSKU.isModified("price")) {
          inventory.productCode = productSKU.productId;
          inventory.price = productSKU.price;
          await inventory.save();
        }
      } else {
        const inventoryObj = {
          productCode: productSKU.productId,
          productSKUBarcode: productSKU.barcode,
          currentQuantity: 0,
          originalQuantity: 0,
          soldQuantity: 0,
        };
        const inventoryInstance = new Inventory(inventoryObj);
        await inventoryInstance.save();
      }
    })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(err);
    });
});

ProductSKUSchema.pre("deleteMany", { document: false, query: true }, async function (next) {
  try {
    const productSKUs = await this.model.find(this.getFilter());
    const barcodeList = productSKUs.map(productSKU => productSKU.barcode);
    await Inventory.deleteMany({ productSKUBarcode: { $in: barcodeList } });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("ProductSKU", ProductSKUSchema);


