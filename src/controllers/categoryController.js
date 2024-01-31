const Category = require("../models/Category");
const Product = require("../models/Product");
const notificationController = require("./notificationController");

const categoryController = {
  //admin api
  //getAll
  getAll: async (req, res) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
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
        const category = await Category.findOneAndDelete({
          _id: req.params.id,
        });
        const notification = {
          title: "Delete notification",
          body: (req.user?.name || "No name") + " deleted category " + category["name"],
          image: category["image"] || "",
          link: "/category",
          fromUserId: req.user?._id,
          toUserId: "admin",
        };
        await notificationController.create(req, notification);
        return res
          .status(200)
          .send({ message: "Delete category successfully." });
      } else {
        return res
          .status(409)
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

      const notification = {
        title: "Create notification",
        body: (req.user?.name || "No name") + " created category " + newCategory["name"],
        image: newCategory["image"] || "",
        link: "/category",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ message: "Create category successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getCategoryInfo: async (req, res) => {
    try {
      const category = await Category.findOne({
        _id: req.params.id,
      });

      res.status(200).send({ category });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  editCategory: async (req, res) => {
    try {
      const updateField = req.body;

      const newCategory = await Category.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: updateField,
        }
      );

      const notification = {
        title: "Edit notification",
        body: (req.user?.name || "No name") + " edited category " + newCategory["name"],
        image: newCategory["image"] || "",
        link: "/category",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res
        .status(200)
        .send({ newCategory, message: "Update category successful." });
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
      const categories = await Category.find({ status: "active" })
        .skip(skip)
        .limit(limit);

      res.status(200).send({ categories });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = categoryController;
