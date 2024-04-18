const dayjs = require("dayjs");
const DiscountProgram = require("../models/DiscountProgram");
const Product = require("../models/Product");
const ProductDiscount = require("../models/ProductDiscount");
const { generateID } = require("../utils/functionHelper");
const notificationController = require("./notificationController");
const { CURRENT_DATE } = require("../utils/constant");

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

      if (discountProgram._doc?.status === "active") {
        return res
          .status(409)
          .send({ message: "Discount Program is running." });
      }

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
      const status = dayjs(req.body.dateStart).isAfter(dayjs())
        ? "incoming"
        : req.body.status;

      let productDiscountIds = [];
      await Promise.all(
        req.body.products.map(async (item) => {
          const newProductDiscount = new ProductDiscount({
            ...item,
            discountProgramCode: discountProgramCode,
            status: status === "active",
          });
          const productDiscount = await newProductDiscount.save();
          productDiscountIds.push(productDiscount._id);
        })
      );

      await DiscountProgram.create({
        ...req.body,
        status,
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
      const discountProgram = await DiscountProgram.findById(req.params.id);

      if (discountProgram._doc?.status === "active") {
        return res
          .status(409)
          .send({ message: "Discount Program is running." });
      }

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
                $set: { ...item, status: req.body?.status === "active" },
              }
            );
          } else {
            const newProductDiscount = new ProductDiscount({
              ...item,
              discountProgramCode: req.body?.discountProgramCode,
              status: req.body?.status === "active",
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

  changeStatus: async (req, res) => {
    try {
      const discountProgram = await DiscountProgram.findById(req.params.id);

      let status =
        req.body.status === "disable"
          ? "disable"
          : dayjs(discountProgram._doc.dateStart)
              .startOf("day")
              .isAfter(dayjs().startOf("day"))
          ? "incoming"
          : req.body.status;

      const updateFields = {
        status,
      };

      const newDiscountProgram = await DiscountProgram.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: updateFields,
        }
      );

      const notificationAdmin = {
        title: "Discount Program notification",
        body:
          req.user?.name ||
          "No name" +
            ` ${updateFields.status} discount program ` +
            newDiscountProgram["name"],
        image: "",
        link: "/discount-program",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
      await notificationController.create(req, notificationAdmin);

      res.status(200).send({
        id: req.params.id,
        message: `Change status to ${updateFields.status?.toUpperCase()} successful.`,
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
      const discountPrograms = await DiscountProgram.find({ status: "active" })
        .populate("productList")
        .then(async (data) => {
          const modifiedData = await Promise.all(
            data.map(async (item) => {
              const products = await Promise.all(
                item.productList.map(async (product) => {
                  const prod = await Product.findById(product.productCode);
                  return {
                    ...prod._doc,
                    ...product._doc,
                  };
                })
              );
              return {
                ...item._doc,
                products,
              };
            })
          );
          return modifiedData;
        });

      res.status(200).send({ discountPrograms });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = discountProgramController;
