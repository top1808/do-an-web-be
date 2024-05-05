const { redisClient } = require("../config/redis");
const inventoryService = require("./inventoryService");

const orderService = {
  async handleMultipleRequest(product, res) {
    try {

      const inventory = await inventoryService.checkProductInventory(product);
      const keyName = product["productSKUBarcode"];

      const getKey = await redisClient.exists(keyName);

      if (!getKey) {
        await redisClient.set(keyName, 0);
      }

      let soldQuantity = await redisClient.get(keyName);
      if (
        soldQuantity + product["quantity"] >
        inventory["inventory"]["currentQuantity"]
      ) {

        return {
          status: false,
          product,
        };
      }
      // Xu ly ban qua hang ton kho
      soldQuantity = await redisClient.incrBy(keyName, product["quantity"]);
      if (soldQuantity > inventory["inventory"]["currentQuantity"]) {
        await redisClient.set(
          "banqua",
          soldQuantity - inventory["inventory"]["currentQuantity"]
        );
        return {
          status: false,
        };
      }
      return {
        status: true,
      };
    } catch (err) {
      console.log("🚀 ~ handleMultipleRequest ~ err:", err);
    }
  },
};

module.exports = orderService;
