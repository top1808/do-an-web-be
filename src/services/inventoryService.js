const Inventory = require("../models/Inventory");

const inventoryService = {
  getInventories: async (query, offset, limit) => {
    return await Inventory.find(query)
      .sort({ productCode: 1 })
      .skip(offset)
      .limit(limit)
      .populate("product")
      .populate("productSKU")
      .populate("historyImport")
      .then((data) => {
        return data.map((item) => {
          return {
            ...item._doc,
            productSKU: item["productSKU"]?.[0],
            product: item["product"]?.[0],
            historyImport: item["historyImport"],
          };
        });
      });
  },
  getTotalInventories: async (query) => {
    return await Inventory.countDocuments(query);
  },

  getProductInventory: async (product) => {
    return await Inventory.findOne({
      productCode: product.productCode,
      productSKUBarcode: product.productSKUBarcode,
    });
  },

  checkProductInventory: async (product) => {
    const inventory = await inventoryService.getProductInventory(product);
    if (inventory._doc.currentQuantity >= product.quantity) {
      return {
        status: true,
        inventory: inventory._doc,
      };
    }
    return {
      status: false,
      inventory: inventory._doc,
    };
  },
};

module.exports = inventoryService;
