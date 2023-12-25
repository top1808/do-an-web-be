const Category = require("../models/Category");
const Product = require("../models/Product");

const categoryController = {
  //admin api
  //getAll
  getAll: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).send({ categories });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //delete
  delete: async (req, res) => {
    try {
      const products = await Product.find({
        categoryIds: req.params.id,
      }).select(["-image", "-description"]);

      if (products?.length === 0) {
        const category = await Category.deleteOne({ _id: req.params.id });
        return res
          .status(200)
          .send({ message: "Delete category successfully." });
      } else {
        return res
          .status(406)
          .send({ message: "Category contains product. Cannot delete." });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //create
  create: async (req, res) => {
    try {
      const newCategory = new Category(req.body);
      await newCategory.save();

      res.status(200).send({ message: "Create category successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  edit: async (req, res) => {
    try {
      res.status(200).send({ message: "Edit category successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  //customer api
  getCategories: async (req, res) => {
    try {
      const query = req.query;
      const skip = query?.skip || 0;
      const limit = query?.limit || 20;
      const categories = await Category.find().skip(skip).limit(limit);

      res.status(200).send({ categories });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getCategoryInfo: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);

      res.status(200).send({ category });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  editCategory: async (req, res) => {
    try {
      const updateField = req.body;

      const newCategory = await Category.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: updateField,
        }
      );
      res
        .status(200)
        .send({ newCategory, message: "Update category successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = categoryController;
