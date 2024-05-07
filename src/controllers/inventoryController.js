const dayjs = require("dayjs");
const notificationController = require("./notificationController");
const Inventory = require("../models/Inventory");
const InventoryImportHistory = require("../models/InventoryImportHistory");
const inventoryService = require("../services/inventoryService");
const productService = require("../services/productService");

const inventoryController = {
  getData: async (req, res) => {
    try {
      const query = req.query;

      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      let myQuery = {};
      if (query?.currentQuantity === "low_on_stock") {
        myQuery = {
          currentQuantity: { $lte: 10, $gt: 0 },
        };
      } else if (query?.currentQuantity === "out_of_stock") {
        myQuery = {
          currentQuantity: { $eq: 0 },
        };
      }

      const inventories = await inventoryService.getInventories(
        myQuery,
        offset,
        limit
      );
      const total = await inventoryService.getTotalInventories(myQuery);

      res.status(200).send({ inventories, query });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //delete
  delete: async (req, res) => {
    try {
      const inventory = await Inventory.findById(req.params.id);

      await inventory.deleteOne();

      const notification = {
        title: "Delete notification",
        body:
          (req.user?.name || "No name") +
          " deleted inventory of product with barcode is " +
          inventory["productSKUBarcode"],
        image: "",
        link: "/inventory",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ message: "Xóa lịch sử nhập hàng thành công." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //create
  create: async (req, res) => {
    try {
      const newInventory = new Inventory({
        ...req.body,
        soldQuantity: 0,
        currentQuantity: req.body.originalQuantity,
      });

      const inventory = await newInventory.save();

      const notification = {
        title: "Create notification",
        body:
          (req.user?.name || "No name") +
          " import product with barcode is " +
          newInventory["productSKUBarcode"],
        image: "",
        link: "/inventory",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ inventory, message: "Nhập hàng thành công." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  importByProductSKU: async (req, res) => {
    try {
      const newInventoryImportHistory = new InventoryImportHistory({
        ...req.body,
      });
      const inventory = await newInventoryImportHistory.save();

      await Inventory.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: {
            originalQuantity: req.body.quantityImport,
            currentQuantity: req.body.quantityImport,
          },
          $push: { historyImportId: inventory._id },
        }
      );

      const notification = {
        title: "Import notification",
        body:
          (req.user?.name || "No name") +
          " import inventory for product with barcode is " +
          newInventoryImportHistory["productSKUBarcode"],
        image: "",
        link: "/inventory",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ inventory, message: "Nhập hàng thành công." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  deleteHistoryImport: async (req, res) => {
    try {
      const findInventory = await Inventory.findById(req.body.inventoryId);
      const inventory = await InventoryImportHistory.findById(req.params.id);

      if (inventory["quantityImport"] > findInventory["currentQuantity"]) {
        return res
          .status(400)
          .send({ message: "Đã bán sản phẩm trong lần nhập kho này." });
      }

      await inventory.deleteOne();

      await findInventory.updateOne({
        $inc: {
          originalQuantity: -inventory._doc.quantityImport,
          currentQuantity: -inventory._doc.quantityImport,
        },
        $pull: { historyImportId: req.params.id },
      });

      const notification = {
        title: "Delete notification",
        body:
          (req.user?.name || "No name") +
          " delete history import inventory for product with barcode is " +
          inventory["productSKUBarcode"],
        image: "",
        link: "/inventory",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ message: "Xóa lịch sử nhập hàng thành công." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  edit: async (req, res) => {
    try {
      res.status(200).send({ message: "Cập nhật kho hàng thành công." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getById: async (req, res) => {
    try {
      const inventory = await Inventory.findById(req.params.id)
        .populate("product")
        .populate("productSKU")
        .populate({
          path: "historyImport",
          options: {
            sort: { createdAt: -1 },
          },
        })
        .then((item) => {
          return {
            ...item._doc,
            productSKU: item["productSKU"]?.[0],
            product: item["product"]?.[0],
            historyImport: item["historyImport"],
          };
        });
      res.status(200).send({ inventory });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = inventoryController;
