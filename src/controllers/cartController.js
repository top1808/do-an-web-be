const Cart = require("../models/Cart");

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

      res.status(200).send({ message: "Thêm sản phẩm thành công." });
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
};

module.exports = cartController;
