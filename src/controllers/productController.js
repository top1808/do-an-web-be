const Product = require("../models/Product");
const ProductSKU = require("../models/ProductSKU");
const {
  generateBarcode,
  addElementToArrayUnique,
} = require("../utils/functionHelper");
const notificationController = require("./notificationController");

const productController = {
  //getAll
  getData: async (req, res) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 10;

      let products = await Product.find()
        .select(["-image", "-description"])
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

      await ProductSKU.deleteMany({ productId: req.params.id });

      const notification = {
        title: "Delete notification",
        body:
          (req.user?.name || "No name") + " deleted product " + product["name"],
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
      newProduct["minPrice"] = 0;
      newProduct["maxPrice"] = 0;
      const productSKUBarcodes = [];

      if (req.body.productSKU) {
        for (const key in req.body.productSKU) {
          const parseKey = JSON.parse(key);
          const barcode = generateBarcode();
          productSKUBarcodes.push(barcode);

          const newProductSKU = new ProductSKU({
            ...parseKey,
            option2: parseKey?.option2 || "",
            price: req.body.productSKU[key],
            barcode,
            productId: newProduct._id,
          });
          await newProductSKU.save();
        }

        newProduct["minPrice"] = Math.min(
          ...Object.values(req.body.productSKU)
        );
        newProduct["maxPrice"] = Math.max(
          ...Object.values(req.body.productSKU)
        );
        newProduct["price"] = null;
      }
      newProduct["productSKUBarcodes"] = productSKUBarcodes;
      await newProduct.save();

      await Product.findById(newProduct._id).populate("categoryList");

      const notification = {
        title: "Create notification",
        body:
          (req.user?.name || "No name") +
          " created product " +
          newProduct["name"],
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
      const productId = req.params.id;
      const productSKUBarcodes = [];

      updateField["minPrice"] = 0;
      updateField["maxPrice"] = 0;

      if (updateField.productSKU) {
        let arrayOption1 = [];
        let arrayOption2 = [];
        for (const key in updateField.productSKU) {
          const parseKey = JSON.parse(key);
          addElementToArrayUnique(arrayOption1, parseKey?.option1);
          if (parseKey?.option2) {
            addElementToArrayUnique(arrayOption2, parseKey?.option2);
          }
          const findProductSKU = await ProductSKU.findOneAndUpdate(
            {
              productId: productId,
              option1: parseKey.option1,
              option2: parseKey?.option2 || "",
            },
            {
              $set: {
                price: updateField.productSKU[key],
              },
            }
          );

          if (!findProductSKU) {
            const barcode = generateBarcode();
            productSKUBarcodes.push(barcode);
            const newProductSKU = new ProductSKU({
              ...parseKey,
              price: updateField.productSKU[key],
              barcode,
            });
            await newProductSKU.save();
          } else {
            productSKUBarcodes.push(findProductSKU.barcode);
          }
        }
        let query = {
          productId: productId,
          $or: [{ option1: { $nin: arrayOption1 } }],
        };

        if (arrayOption2.length > 0) {
          query.$or = [...query.$or, { option2: { $nin: arrayOption2 } }];
        }
        await ProductSKU.deleteMany(query);

        minPrice = Math.min(...Object.values(req.body.productSKU));
        maxPrice = Math.max(...Object.values(req.body.productSKU));
        updateField["minPrice"] = minPrice;
        updateField["maxPrice"] = maxPrice;
        updateField["price"] = null;
      }

      updateField.productSKUBarcodes = productSKUBarcodes;

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
        body:
          (req.user?.name || "No name") +
          " editted product " +
          newProduct["name"],
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
      const product = await Product.findById(req.params.id).populate(
        "productSKUDetails"
      );

      res.status(200).send({
        product: { ...product._doc, productSKUList: product.productSKUDetails },
      });
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
      const search = req.params?.search;

      let query = {
        status: "active",
      };

      if (search.trim() !== "") {
        query.name = { $regex: new RegExp(search, "i") };
      }

      const products = await Product.find(query).populate("categoryIds");

      res.status(200).send({ products });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = productController;
