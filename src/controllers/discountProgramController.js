const DiscountProgram = require("../models/DiscountProgram");
const Product = require("../models/Product");
const ProductDiscount = require("../models/ProductDiscount");
const { generateID } = require("../utils/functionHelper");
const notificationController = require("./notificationController");

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

      await ProductDiscount.deleteMany({
        discountProgramCode: discountProgram["discountProgramCode"],
      });

      const notification = {
        title: "Delete notification",
        body:
          (req.user?.name || "No name") +
          " deleted discount program " +
          discountProgram["name"],
        image: "",
        link: "/discount-program",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ message: "Delete discount program success." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //create
  create: async (req, res) => {
    try {
      const discountProgramCode = generateID();

      let productDiscountIds = [];
      await Promise.all(
        req.body.products.map(async (item) => {
          const newProductDiscount = new ProductDiscount({
            ...item,
            discountProgramCode: discountProgramCode,
          });
          const productDiscount = await newProductDiscount.save();
          productDiscountIds.push(productDiscount._id);
        })
      );

      await DiscountProgram.create({
        ...req.body,
        discountProgramCode,
        products: productDiscountIds,
      });

      const notification = {
        title: "Create notification",
        body:
          (req.user?.name || "No name") +
          " created discount program " +
          req.body["name"],
        image: "",
        link: "/discount-program",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res.status(200).send({ message: "Create discount program success." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  edit: async (req, res) => {
    try {
      let productDiscountIds = [];
      await Promise.all(
        req.body.products.map(async (item) => {
          if (item?._id) {
            productDiscountIds.push(item._id);
            await ProductDiscount.updateOne(
              {
                _id: item._id,
              },
              {
                $set: item,
              }
            );
          } else {
            const newProductDiscount = new ProductDiscount({
              ...item,
              discountProgramCode: req.body?.discountProgramCode,
            });
            const productDiscount = await newProductDiscount.save();
            productDiscountIds.push(productDiscount._id);
          }
        })
      );

      const updateField = { ...req.body, products: productDiscountIds };

      const newDiscountProgram = await DiscountProgram.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: updateField,
        }
      );

      await ProductDiscount.deleteMany({
        discountProgramCode: newDiscountProgram["discountProgramCode"],
        _id: { $nin: productDiscountIds },
      });

      const notification = {
        title: "Edit notification",
        body:
          (req.user?.name || "No name") +
          " editted discount program " +
          newDiscountProgram["name"],
        image: "",
        link: "/discount-program",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notification);

      res
        .status(200)
        .send({ newDiscountProgram, message: "Cập nhật voucher thành công." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getById: async (req, res) => {
    try {
      const discountProgram = await DiscountProgram.findById(
        req.params.id
      ).populate(["productList"]);

      res.status(200).send({
        discountProgram: {
          ...discountProgram._doc,
          products: discountProgram.productList,
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
