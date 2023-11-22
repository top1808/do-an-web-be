const Category = require("../models/Category");
const Product = require("../models/Product");

const categoryController = {
    //admin api
    //getAll
    getAll: async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).send({categories});
        } catch (err) {
            res.status(500).send(err);
        }
    },
    //delete
    delete: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            await category.deleteOne();
            await Product.deleteMany({ categoryIds: req.params.id })
            res.status(200).send({message: "Delete category successfully."});
        } catch (err) {
            res.status(500).send(err);
        }
    },
     //create
    create: async (req, res) => {
        try {
            const newCategory = new Category(req.body)
            await newCategory.save();

            res.status(200).send({ message: "Create category successfully."});
        } catch (err) {
            res.status(500).send(err);
        }
    },
    edit: async (req, res) => {
        try {
            res.status(200).send({ message: "Edit category successfully."});
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
          res.status(200).send({ newCategory, message: "Update category successful." });
        } catch (err) {
          res.status(500).send(err);
        }
      },
    
}

module.exports = categoryController;