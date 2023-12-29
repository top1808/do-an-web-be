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

      await Product.updateMany(
        { discountProgramId: req.params.id },
        { $set: { discountProgramId: null } }
      );

      res.status(200).send({ message: "Delete discount program success." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //create
  create: async (req, res) => {
    try {
      const newDiscountProgram = await DiscountProgram.create({ ...req.body });

      const productIds = req.body.products?.map((item) => item.productCode);

      await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { discountProgramId: newDiscountProgram._id } }
      );

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

      const productIds = req.body.products?.map((item) => item.productCode);

      await Product.bulkWrite([
        {
          updateMany: {
            filter: {
              _id: { $in: productIds },
              discountProgramId: { $ne: req.params.id },
            },
            update: { $set: { discountProgramId: req.params.id } },
          },
        },
        {
          updateMany: {
            filter: {
              _id: { $nin: productIds },
              discountProgramId: req.params.id,
            },
            update: { $set: { discountProgramId: null } },
          },
        },
      ]);

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
        const findProduct = await Product.findById(product.productCode, {
          name: 1,
          price: 1,
        });
        newProducts.push({
          productName: findProduct.name,
          price: findProduct.price,
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

  getListDiscountProgram: async (req, res) => {
    try {
      const discountPrograms = await DiscountProgram.find({ status: "active" });

      const newDiscountPrograms = [];

      for (const program of discountPrograms) {
        const newProducts = [];

        for (const product of program.products) {
          const findProduct = await Product.findOne({
            _id: product.productCode,
            status: "active",
          }).select(["-categoryIds", "-description", "-discountProgramId"]);
          newProducts.push({
            ...findProduct._doc,
            ...product._doc,
            _id: findProduct._id,
          });
        }
        newDiscountPrograms.push({
          ...program._doc,
          products: newProducts,
        });
      }

      res.status(200).send({ discountPrograms: newDiscountPrograms });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = discountProgramController;
