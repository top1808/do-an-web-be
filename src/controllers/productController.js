const Category = require("../models/Category");
const Product = require("../models/Product");

const productController = {
  //getAll
  getAll: async (req, res, next) => {
    try {
      const products = await Product.find();
      res.status(200).send({ products });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //delete
  delete: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      await product.deleteOne();
      res.status(200).send({ message: "Delete product successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //create
  create: async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();

      await Product.findById(newProduct._id).populate("categoryList");

      res.status(200).send({ message: "Create product successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  //customer api
  getProducts: async (req, res) => {
    try {
      const query = req.query;
      const skip = query?.skip || 0;
      const limit = query?.limit || 20;
      const products = await Product.find().skip(skip).limit(limit);

      res.status(200).send({ products });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = productController;