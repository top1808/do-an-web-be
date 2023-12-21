const dayjs = require("dayjs");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { generateID } = require("../utils/functionHelper");
const Voucher = require("../models/Voucher");

const cartController = {
  getCart: async (req, res) => {
    try {
      const customerId = await req.header("userId");
      const carts = await Cart.find({ customerId: customerId }).populate(
        "product"
      );

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
          product: req.body._id,
          price: req.body.price,
          promotionPrice: 0,
          quantity: req.body.quantity,
          totalPrice: req.body.price * req.body.quantity,
        };
        const findCart = await Cart.findOne({
          customerId: data.customerId,
          product: data.product,
        });

        if (findCart) {
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

      const data = req.body;

      const newOrder = new Order({
        ...data,
        customerCode: customerId,
        orderCode: generateID(),
        status: "delivering",
        deliveryDate: dayjs(new Date()).add(3, "days").format("YYYY-MM-DD"),
        voucherCode: data.voucher.code,
        voucherDiscount: data.voucher.discountValue,
        totalPrice: data.totalProductPrice + data.deliveryFee - data.voucher.discountValue
      });

      const order = await newOrder.save();

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
