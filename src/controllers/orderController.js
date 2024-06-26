const { sendEmail } = require("../config/nodemailer");
const Inventory = require("../models/Inventory");
const Order = require("../models/Order");
const Product = require("../models/Product");
const ProductOrder = require("../models/ProductOrder");
const Voucher = require("../models/Voucher");
const inventoryService = require("../services/inventoryService");
const orderService = require("../services/orderService");
const ConfirmOrderTemplate = require("../templates/email/ConfirmOrderEmail.template");
const { PAYMENT_METHOD } = require("../utils/constant");
const { generateID } = require("../utils/functionHelper");
const notificationController = require("./notificationController");

const orderController = {
  //getAll
  getAll: async (req, res) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      const total = await Order.find().count();

      const pagination = {
        total,
        offset,
        limit,
        page: offset / limit + 1,
      };

      res.status(200).send({ orders, pagination });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //delete
  delete: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      await order.deleteOne();

      await ProductOrder.deleteMany({
        orderCode: order["orderCode"],
      });

      const notification = {
        title: "Delete notification",
        body:
          (req.user?.name || "No name") +
          " deleted order " +
          order["orderCode"],
        image: "",
        link: "/order",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);
      res.status(200).send({ message: "Delete order successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //create
  create: async (req, res) => {
    try {
      const orderCode = req.body?.orderCode || generateID();
      let productOrderIds = [];
      await Promise.all(
        req.body.products.map(async (item) => {
          const findProductImage = await Product.findOne({
            _id: item.productCode,
          }).select("images");

          const newProductOrder = new ProductOrder({
            ...item,
            orderCode: orderCode,
            image: findProductImage._doc.images[0] || "",
          });
          const productOrder = await newProductOrder.save();
          productOrderIds.push(productOrder._id);
        })
      );

      const newOrder = new Order({
        ...req.body,
        orderCode: orderCode,
        products: productOrderIds,
      });

      const order = await newOrder.save();

      const notification = {
        title: "Create notification",
        body:
          (req.user?.name || "No name") +
          " created order " +
          newOrder["orderCode"],
        image: "",
        link: "/order",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ order, message: "Create order successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  edit: async (req, res) => {
    try {
      let productOrderIds = [];
      await Promise.all(
        req.body.products.map(async (item) => {
          if (item?._id) {
            productOrderIds.push(item._id);
            await ProductOrder.updateOne(
              {
                _id: item._id,
              },
              {
                $set: item,
              }
            );
          } else {
            const findProductImage = await Product.findOne({
              _id: item.productCode,
            }).select("images");

            const newProductOrder = new ProductOrder({
              ...item,
              orderCode: req.body?.orderCode,
              image: findProductImage._doc.images[0] || "",
            });
            const productOrder = await newProductOrder.save();
            productOrderIds.push(productOrder._id);
          }
        })
      );

      const updateField = { ...req.body, products: productOrderIds };

      const newOrder = await Order.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: updateField,
        }
      );

      await ProductOrder.deleteMany({
        orderCode: newOrder["orderCode"],
        _id: { $nin: productOrderIds },
      });

      const notification = {
        title: "Edit notification",
        body:
          (req.user?.name || "No name") +
          " editted order " +
          newOrder["orderCode"],
        image: "",
        link: "/order",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ newOrder, message: "Update order successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  changeStatus: async (req, res) => {
    try {
      const updateFields = {
        status: req.body.status,
        deliveryAddress: req.body?.deliveryAddress || "",
        deliveryDate: req.body?.deliveryDate || "",
        receivedDate: req.body?.receivedDate || "",
        reasonCancel: req.body?.reason || "",
      };

      const productsNotEnoughQuantity = [];
      const order = await Order.findById(req.params.id).populate("productList");

      if (order._doc.status === "received") {
        return res.status(400).send({ message: "Đơn hàng này đã hoàn thành." })
      }

      const dataEmail = {
        ...order._doc,
        ...updateFields,
        paymentMethod: PAYMENT_METHOD[order._doc.paymentMethod],
        products: order["productList"],
        deliveryDate: order?._doc?.deliveryDate || updateFields?.deliveryDate
      }

      await orderService.sendOrderEmail(updateFields.status, dataEmail)

      if (updateFields.status === "confirmed") {
        for (let product of order["productList"]) {
          const result = await orderService.handleMultipleRequest(product, res);
          if (!result.status) productsNotEnoughQuantity.push(result?.product);
        }
      }

      if (productsNotEnoughQuantity.length > 0) {
        return res.status(404).send({
          message: `Những sản phẩm có mã barcode sau không đủ số lượng trong kho: ${productsNotEnoughQuantity
            .reduce((acc, elm) => {
              acc += elm.productSKUBarcode + ", ";
              return acc;
            }, "")
            .slice(0, -2)}`,
        });
      }

      for (const key in updateFields) {
        if (!updateFields[key]) delete updateFields[key];
      }

      const newOrder = await Order.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: updateFields,
        }
      );

      if (updateFields.status === "canceled" && order["voucherCode"]) {
        await Voucher.updateOne(
          {
            code: order["voucherCode"],
          },
          {
            $inc: {
              quantityUsed: -1,
            },
          }
        );
      }

      for (let product of order["productList"]) {
        await Inventory.findOneAndUpdate(
          {
            productSKUBarcode: product["productSKUBarcode"],
            productCode: product["productCode"],
          },
          {
            $inc: {
              soldQuantity:
                updateFields.status === "confirmed"
                  ? product["quantity"]
                  : order["status"] !== "processing" &&
                    updateFields.status === "canceled"
                    ? -product["quantity"]
                    : 0,
              currentQuantity:
                updateFields.status === "confirmed"
                  ? -product["quantity"]
                  : order["status"] !== "processing" &&
                    updateFields.status === "canceled"
                    ? product["quantity"]
                    : 0,
            },
          }
        );
      }

      const notificationCustomer = {
        title: "Order notification",
        body: `Your order ${newOrder["orderCode"]} is ${updateFields.status}`,
        image: "",
        link: "/profile/purchased",
        fromUserId: req.user?._id,
        toUserId: newOrder["customerCode"],
      };
      await notificationController.create(req, notificationCustomer);

      res.status(200).send({
        id: req.params.id,
        message: `${updateFields.status?.toUpperCase()} order successful.`,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getById: async (req, res) => {
    try {
      const findOrder = await Order.findById(req.params.id).populate([
        "voucher",
        "productList",
      ]);

      const order = {
        ...findOrder._doc,
        voucher: findOrder.voucher,
        products: findOrder.productList,
      };

      res.status(200).send({ order });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  /************
   * CUSTOMER *
   ************/
  getMyOrder: async (req, res) => {
    try {
      const customerId = await req.header("userId");

      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const orders = await Order.find({ customerCode: customerId })
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Order.find({ customerCode: customerId }).count();

      res.status(200).send({ orders, total, offset, limit });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getMyOrderDetails: async (req, res) => {
    try {
      const customerId = await req.header("userId");

      const order = await Order.findOne({
        _id: req.params.id,
        customerCode: customerId,
      }).populate("productList");

      res.status(200).send({
        order: {
          ...order._doc,
          products: order?.productList,
        },
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  changeStatusCustomer: async (req, res) => {
    try {
      const customerId = await req.header("userId");

      const updateFields = {
        status: req.body.status,
        receivedDate: req.body?.receivedDate || "",
        reasonCancel: req.body?.reason || "",
      };

      for (const key in updateFields) {
        if (!updateFields[key]) delete updateFields[key];
      }

      const productsNotEnoughQuantity = [];
      const order = await Order.findById(req.params.id).populate("productList");

      const dataEmail = {
        ...order._doc,
        paymentMethod: PAYMENT_METHOD[order._doc.paymentMethod],
        products: order["productList"],
      }

      await orderService.sendOrderEmail(updateFields.status, dataEmail)

      if (
        customerId &&
        updateFields.status === "canceled" &&
        order["status"] !== "processing"
      ) {
        return res.status(405).send({
          message: "Bạn không thể hủy đơn hàng. ",
        });
      }

      if (updateFields.status === "confirmed") {
        for (let product of order["productList"]) {
          const result = await orderService.handleMultipleRequest(product, res);
          if (!result.status) productsNotEnoughQuantity.push(result?.product);
        }
      }

      if (productsNotEnoughQuantity.length > 0) {
        return res.status(404).send({
          message: `Những sản phẩm có mã barcode sau không đủ số lượng trong kho: ${productsNotEnoughQuantity
            .reduce((acc, elm) => {
              acc += elm.productSKUBarcode + ", ";
              return acc;
            }, "")
            .slice(0, -2)}`,
        });
      }

      const newOrder = await Order.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: updateFields,
        }
      );

      if (updateFields.status === "canceled" && order["voucherCode"]) {
        await Voucher.updateOne(
          {
            code: order["voucherCode"],
          },
          {
            $inc: {
              quantityUsed: -1,
            },
          }
        );
      }

      for (let product of order["productList"]) {
        await Inventory.findOneAndUpdate(
          {
            productSKUBarcode: product["productSKUBarcode"],
            productCode: product["productCode"],
          },
          {
            $inc: {
              soldQuantity:
                updateFields.status === "confirmed"
                  ? product["quantity"]
                  : order["status"] !== "processing" &&
                    updateFields.status === "canceled"
                    ? -product["quantity"]
                    : 0,
              currentQuantity:
                updateFields.status === "confirmed"
                  ? -product["quantity"]
                  : order["status"] !== "processing" &&
                    updateFields.status === "canceled"
                    ? product["quantity"]
                    : 0,
            },
          }
        );
      }

      const notification = {
        title: "Order notification",
        body:
          (customerId ? `Customer ${newOrder["customerName"]}` : "") +
          ` ${updateFields.status} order ` +
          newOrder["orderCode"],
        image: "",
        link: "/order",
        fromUserId: customerId || "",
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({
        id: req.params.id,
        message: `${updateFields.status?.toUpperCase()} order successful.`,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = orderController;
