const dayjs = require("dayjs");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { generateID } = require("../utils/functionHelper");
const Voucher = require("../models/Voucher");
const notificationController = require("./notificationController");
const ProductOrder = require("../models/ProductOrder");
const ProductDiscount = require("../models/ProductDiscount");
const Product = require("../models/Product");

const cartController = {
  getCart: async (req, res) => {
    try {
      const customerId = await req.header("userId");
      const carts = await Cart.find({ customerId: customerId })
        .populate("product")
        .populate("productSKU")
        .then(async (data) => {
          const modifiedData = await Promise.all(
            data.map(async (item) => {
              const productDiscount = await ProductDiscount.findOne({
                productSKUBarcode: item.productSKUBarcode,
                status: true,
              }).populate("discountProgram");

              if (productDiscount) {
                return {
                  ...item._doc,
                  productSKU: item.productSKU?.[0],
                  discount: {
                    ...productDiscount._doc,
                    discountProgram: productDiscount["discountProgram"],
                  },
                };
              }

              return {
                ...item._doc,
                productSKU: item.productSKU?.[0],
              };
            })
          );
          return modifiedData;
        });

      res.status(200).send({ carts });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  addToCart: async (req, res) => {
    try {
      const customerId = await req.header("userId");
      if (customerId) {
        const data = {
          customerId: customerId,
          product: req.body.productId,
          productSKUBarcode: req.body.barcode,
          price: req.body.price,
          promotionPrice: 0,
          quantity: req.body.quantity,
          totalPrice: req.body.price * req.body.quantity,
        };

        const findCart = await Cart.findOne({
          customerId: data.customerId,
          product: data.product,
          productSKUBarcode: data?.productSKUBarcode,
        });

        if (findCart) {
          if (findCart.quantity + data.quantity > 99) {
            return res.status(400).send({
              message:
                "Bạn chỉ có thể thêm số lượng tối đa 99 trên mỗi sản phẩm.",
            });
          }
          await Cart.updateOne(
            {
              _id: findCart._id,
            },
            {
              $set: {
                quantity: findCart.quantity + data.quantity,
              },
            }
          );
        } else {
          if (data.quantity > 99) {
            return res.status(400).send({
              message:
                "Bạn chỉ có thể thêm số lượng tối đa 99 trên mỗi sản phẩm.",
            });
          }
          const newCartItem = new Cart(data);
          await newCartItem.save();
        }

        return res.status(200).send({ message: "Thêm sản phẩm thành công." });
      }
      res.status(403).send("Bạn chưa đăng nhập.");
    } catch (err) {
      res.status(500).send(err);
    }
  },
  editCartItem: async (req, res) => {
    try {
      const updateField = req.body;

      const newCartItem = await Cart.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: updateField,
        }
      );

      res
        .status(200)
        .send({ newCartItem, message: "Edit item to cart successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  deleteCartItem: async (req, res) => {
    try {
      const findCartItem = await Cart.findById(req.params.id);
      await findCartItem.deleteOne();

      res.status(200).send({ message: "Xóa sản phẩm thành công." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  clearAll: async (req, res) => {
    try {
      const customerId = await req.header("userId");
      if (customerId) {
        await Cart.deleteMany({ customerId: customerId });
        return res
          .status(200)
          .send({ message: "Xóa tất cả sản phẩm thành công." });
      }

      res.status(403).send({ message: "Bạn chưa đăng nhập." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  pay: async (req, res) => {
    try {
      const customerId = await req.header("userId");
      const orderCode = generateID();

      const data = req.body;
      // console.log("🚀 ~ pay: ~ data:", data)

      let productOrderIds = [];
      await Promise.all(
        data?.products.map(async (item) => {
          const findProductImage = await Product.findOne({
            _id: item.productCode
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
        ...data,
        products: productOrderIds,
        customerCode: customerId,
        orderCode: orderCode,
        status: "processing",
        deliveryDate: "",
        voucherCode: data.voucher?.code || "",
        voucherDiscount: data.voucher?.discountValue || 0,
        totalPrice:
          data.totalProductPrice +
          data.deliveryFee -
          (data.voucher?.discountValue || 0),
      });

      const order = await newOrder.save();

      const notification = {
        title: "New Order",
        body: `Customer placed an order with order code ${newOrder?.orderCode}`,
        image: "",
        link: "/order",
        fromUserId: customerId,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      if (data.voucher) {
        await Voucher.updateOne(
          { code: data.voucher.code },
          { $inc: { quantityUsed: 1 } }
        );
      }

      const productsDelete = data.products.map((p) => p.cartId);
      await Cart.deleteMany({ _id: { $in: productsDelete } });

      res.status(200).send({ order, message: "Thanh toán thành công." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = cartController;
