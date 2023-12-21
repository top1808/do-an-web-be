const DiscountProgram = require("../models/DiscountProgram");
const Product = require("../models/Product");

const discountProgramController = {
  getData: async (req, res, next) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const discountPrograms = await DiscountProgram.find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      const total = await DiscountProgram.find().count();

      res.status(200).send({ discountPrograms, total, offset, limit });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //delete
  delete: async (req, res, next) => {
    try {
      const discountProgram = await DiscountProgram.findById(req.params.id);

      await discountProgram.deleteOne();
      res.status(200).send({ message: "Delete discount program success." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //create
  create: async (req, res) => {
    try {
      const newDiscountProgram = new DiscountProgram({
        ...req.body,
      });

      await newDiscountProgram.save();

      res.status(200).send({ message: "Create discount program success." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  edit: async (req, res) => {
    try {
      const updateField = { ...req.body };

      const newDiscountProgram = await DiscountProgram.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: updateField,
        }
      );

      res
        .status(200)
        .send({ newDiscountProgram, message: "Cập nhật voucher thành công." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getById: async (req, res) => {
    try {
      const discountProgram = await DiscountProgram.findById(req.params.id);

      const newProducts = [];

      for (const product of discountProgram.products) {
        const findProduct = await Product.findById(product.productCode);
        newProducts.push({
          productName: findProduct.name,
          price:findProduct.price,
          ...product._doc,
        });
      }

      res.status(200).send({
        discountProgram: {
          ...discountProgram._doc,
          products: newProducts,
        },
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  /************
   * CUSTOMER *
   ************/

  getListDiscountProgram: async (req, res, next) => {
    try {
      const discountPrograms = await DiscountProgram.find();

      res.status(200).send({ discountPrograms });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = discountProgramController;
