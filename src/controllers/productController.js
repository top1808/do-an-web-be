const Product = require("../models/Product");
const ProductDiscount = require("../models/ProductDiscount");
const ProductOrder = require("../models/ProductOrder");
const ProductSKU = require("../models/ProductSKU");
const Review = require("../models/Review");
const inventoryService = require("../services/inventoryService");
const productService = require("../services/productService");
const { generateBarcode, stringToSlug } = require("../utils/functionHelper");
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

      if (product) {
        const productOrder = await ProductOrder.findOne({
          productCode: req.params.id,
        });
        if (productOrder) {
          return res.status(405).send({ message: "Product has been ordered" });
        }
        const productDiscount = await ProductDiscount.findOne({
          productCode: req.params.id,
          status: true,
        });
        if (productDiscount) {
          return res.status(405).send({
            message: "This product has been included in a discount program",
          });
        }
      }

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

          const options = Object.keys(parseKey).map((item) => ({
            groupName: item,
            option: parseKey[item],
          }));

          const newProductSKU = new ProductSKU({
            ...parseKey,
            options: options || [],
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
        let allOptions = [];
        for (const key in updateField.productSKU) {
          const parseKey = JSON.parse(key);
          const options = Object.keys(parseKey).map((item) => ({
            groupName: item,
            option: parseKey[item],
          }));

          allOptions.push(options);

          const findProductSKU = await ProductSKU.findOneAndUpdate(
            {
              productId: productId,
              options: {
                $size: options.length,
                $all: options.map((item) => ({
                  $elemMatch: {
                    groupName: item.groupName,
                    option: item.option,
                  },
                })),
              },
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
              options,
              price: updateField.productSKU[key],
              barcode,
              productId: productId,
            });
            await newProductSKU.save();
          } else {
            productSKUBarcodes.push(findProductSKU.barcode);
          }
        }

        let query = {
          productId: productId,
          $nor: allOptions.map((optionsSet) => ({
            options: {
              $size: optionsSet.length,
              $all: optionsSet.map((option) => ({
                $elemMatch: option,
              })),
            },
          })),
        };

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
        .populate("productSKUDetails")
        .sort({ createdAt: -1 })
        .select(["-image", "-description"])
        .then((data) => {
          return data.map((item) => ({
            ...item._doc,
            productSKUList: item.productSKUDetails,
            discountProgramDetails: item.discountProgramDetails,
          }));
        });

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
      const skip = req.query?.skip || 0;
      const limit = req.query?.limit || 12;

      const data = req.body;

      let sort = {}
      if (data.sortBy) {
        sort = {
          [data.sortBy]: data.sortType === "asc" ? 1 : -1,
        }
      }

      let query = {
        status: "active",
      };

      if (data.rate) {
        query.rate = { $gte: data.rate };
      }

      if (data.minPrice) {
        query.minPrice = { $gte: data.minPrice };
      }

      if (data.maxPrice) {
        query.maxPrice = { $lte: data.maxPrice };
      }

      const products = await productService.getProducts(query, skip, limit, sort);

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
      }).populate("productSKUDetails");
      if (!findProduct)
        return res.status(404).send({ message: "Product is not found." });
      let product = findProduct._doc;

      const rate = await productService.getAvarateRate(product._id);

      const productDiscounts = await ProductDiscount.find({
        productCode: product._id,
        status: true,
      }).populate("discountProgram");

      const reviews = await Review.find({ product: product._id })
        .populate("productSKUDetail")
        .populate("customer", "-password")
        .then((data) => {
          return data.map((item) => {
            return {
              ...item._doc,
              productSKU: item["productSKUDetail"]?.[0],
              customer: item?.isAnonymous ? null : item["customer"]?.[0],
            };
          });
        });

      const productSKUList = [];
      let soldQuantityOfProduct = 0;
      for (let productSKU of findProduct.productSKUDetails) {
        const inventory = await inventoryService.getProductInventory({
          productCode: productSKU["productId"],
          productSKUBarcode: productSKU["barcode"],
        });
        soldQuantityOfProduct += Number(inventory["soldQuantity"]) || 0;
        productSKUList.push({ ...productSKU._doc, inventory });
      }


      let minPromotionPrice = product.minPrice;
      let maxPromotionPrice = product.maxPrice;
      if (productDiscounts?.length > 0) {
        productDiscounts?.forEach((elm) => {
          if (elm._doc.promotionPrice < minPromotionPrice)
            minPromotionPrice = elm._doc.promotionPrice;
          if (
            elm._doc.price === product.maxPrice &&
            elm._doc.promotionPrice < maxPromotionPrice
          )
            maxPromotionPrice = elm._doc.promotionPrice;
        });
      }

      res.status(200).send({
        product: {
          ...product,
          productSKUList,
          discounts: productDiscounts
            ? productDiscounts.map((elm) => ({
              ...elm._doc,
              discountProgram: elm["discountProgram"],
            }))
            : [],
          reviews,
          rate,
          soldQuantityOfProduct,
          minPromotionPrice,
          maxPromotionPrice,
        },
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getProductByCategory: async (req, res) => {
    try {
      const data = req.query;

      const offset = Number(data?.offset) || 0;
      const limit = Number(data?.limit) || 12;

      let sort = {}
      if (data.sortBy) {
        sort = {
          [data.sortBy]: data.sortType === "asc" ? 1 : -1,
        }
      }

      const query = {
        ...(req.params.categoryId === "all" ? {} : { categoryIds: {$in: [req.params.categoryId]} }),
        status: "active",
        ...(data?.minPrice ? { minPrice: { $gte: Number(data.minPrice) } } : {}),
        ...(Number(data?.maxPrice) > 0 ? { maxPrice: { $lte: Number(data.maxPrice) } } : {}),
      };

      const products = await productService.getProducts(query, offset, limit, sort);

      let total = 0;
      if (req.params.categoryId === "all") {
        total = await Product.countDocuments(query);
      } else {
        total = await Product.countDocuments({
          ...query
        });
      }

      const newProducts = products?.filter((elm) => Number(elm.rate) >= Number(data.rate));

      const pagination = {
        total,
        offset,
        limit,
        page: offset / limit + 1,
      };

      res.status(200).send({ products: newProducts, pagination });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getProductRelative: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      const { categoryIds } = product._doc;

      const products = await productService.getProducts({
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

      const data = req.query;

      const offset = Number(data?.offset) || 0;
      const limit = Number(data?.limit) || 12;

      let sort = {}
      if (data.sortBy) {
        sort = {
          [data.sortBy]: data.sortType === "asc" ? 1 : -1,
        }
      }

      const query = {
        status: "active",
        ...(data?.minPrice ? { minPrice: { $gte: Number(data.minPrice) } } : {}),
        ...(Number(data?.maxPrice) > 0 ? { maxPrice: { $lte: Number(data.maxPrice) } } : {}),
        ...(search?.trim() ? { slug: { $regex: new RegExp(stringToSlug(search), "i") } } : {}),
      };

      const products = await productService.getProducts(query, offset, 100, sort);

      const newProducts = products?.filter((elm) => Number(elm.rate) >= Number(data.rate));

      // const total = await Product.countDocuments(query);

      res.status(200).send({ products: newProducts });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  filterProducts: async (req, res) => {
    try {
      const offset = Number(req.query?.offset) || 0;
      const limit = Number(req.query?.limit) || 12;

      const data = req.body;

      const sort = {
        [data.sortBy]: data.sortType === "asc" ? 1 : -1,
      }

      let query = {
        status: "active",
      };

      if (data.rate) {
        query.rate = { $gte: data.rate };
      }

      if (data.minPrice) {
        query.minPrice = { $gte: data.minPrice };
      }

      if (data.maxPrice) {
        query.maxPrice = { $lte: data.maxPrice };
      }

      const products = await productService.getProducts(query, offset, limit, sort);

      res.status(200).send({ products });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  hintSearchProducts: async (req, res) => {

  }

};

module.exports = productController;
