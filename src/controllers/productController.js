const Product = require("../models/Product");
const notificationController = require("./notificationController");

const productController = {
  //getAll
  getData: async (req, res) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 10;

      let products = await Product.find()
        .populate("categoryIds")
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

      const total = await Product.find().count();

      const pagination = {
        total,
        offset,
        limit,
        page: offset / limit + 1,
      };

      res.status(200).send({ products, pagination });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //delete
  delete: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      await product.deleteOne();

      const notification = {
        title: "Delete notification",
        body: (req.user?.name || "No name") + " deleted product " + product["name"],
        image: "",
        link: "/product",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

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

      const notification = {
        title: "Create notification",
        body: (req.user?.name || "No name") + " created product " + newProduct["name"],
        image: "",
        link: "/product",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ message: "Create product successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  editProduct: async (req, res) => {
    try {
      const updateField = req.body;

      const newProduct = await Product.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: updateField,
        }
      );

      const notification = {
        title: "Edit notification",
        body: (req.user?.name || "No name") + " editted product " + newProduct["name"],
        image: "",
        link: "/product",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res
        .status(200)
        .send({ newProduct, message: "Update product successful." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getProductInfo: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      res.status(200).send({ product });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getAllProduct: async (req, res) => {
    try {
      let products = await Product.find()
        .populate("categoryIds")
        .sort({ createdAt: -1 })
        .select(["-image", "-description"]);

      res.status(200).send({ products });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  /******************
   *CUSTOMER API *
   ******************/
  getProducts: async (req, res) => {
    try {
      const query = req.query;
      const skip = query?.skip || 0;
      const limit = query?.limit || 12;
      const products = await Product.find({
        status: "active",
      })
        .skip(skip)
        .limit(limit);

      res.status(200).send({ products });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getProductDetails: async (req, res) => {
    try {
      const findProduct = await Product.findOne({
        _id: req.params.id,
        status: "active",
      }).populate("discountProgramDetails");
      if (!findProduct)
        return res.status(404).send({ message: "Product is not found." });
      let product = findProduct._doc;

      const discountProgram = findProduct["discountProgramDetails"][0];

      if (discountProgram && discountProgram.products) {
        for (const p of discountProgram.products) {
          product = {
            ...product,
            promotionPrice: p.promotionPrice,
            type: p.type,
            valueDiscount: p.value,
          };
        }
      }

      res.status(200).send({ product });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getProductByCategory: async (req, res) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 12;

      const products = await Product.find(
        req.params.categoryId === "all"
          ? {}
          : { categoryIds: req.params.categoryId }
      )
        .skip(offset)
        .limit(limit);

      let total = 0;
      if (req.params.categoryId === "all") {
        total = await Product.estimatedDocumentCount();
      } else {
        total = await Product.countDocuments({
          categoryIds: req.params.categoryId,
        });
      }

      const pagination = {
        total,
        offset,
        limit,
        page: offset / limit + 1,
      };

      res.status(200).send({ products, pagination });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getProductRelative: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      const { categoryIds } = product._doc;

      const products = await Product.find({
        status: "active",
        categoryIds: { $in: categoryIds },
        _id: { $ne: product._id },
      });

      res.status(200).send({ products });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  searchProducts: async (req, res) => {
    try {
      const search = req.params.search;

      const products = await Product.find({
        name: { $regex: new RegExp(search, "i") },
        status: "active",
      }).populate("categoryIds");

      res.status(200).send({ products });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = productController;
