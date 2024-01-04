const Voucher = require("../models/Voucher");

const voucherController = {
  getData: async (req, res, next) => {
    try {
      const query = req.query;
      const offset = Number(query?.offset) || 0;
      const limit = Number(query?.limit) || 20;

      const vouchers = await Voucher.find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
      const total = await Voucher.find().count();

      res.status(200).send({ vouchers, total, offset, limit });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //delete
  delete: async (req, res, next) => {
    try {
      const voucher = await Voucher.findById(req.params.id);

      await voucher.deleteOne();
      res.status(200).send({ message: "Xóa voucher thành công." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  //create
  create: async (req, res) => {
    try {
      const newVoucher = new Voucher({
        ...req.body,
        quantityUsed: 0,
        quantityLeft: req.body.quantity,
        maxDiscountValue:
          req.body?.type === "percent"
            ? req.body.maxDiscountValue
            : req.body.value,
      });

      const voucher = await newVoucher.save();

      res.status(200).send({ voucher, message: "Tạo mới voucher thành công." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  edit: async (req, res) => {
    try {
      const updateField = { ...req.body };

      const newVoucher = await Voucher.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: updateField,
        }
      );

      res
        .status(200)
        .send({ newVoucher, message: "Cập nhật voucher thành công." });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  getById: async (req, res) => {
    try {
      const voucher = await Voucher.findById(req.params.id);
      res.status(200).send({ voucher });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  /************
   * CUSTOMER *
   ************/

  getListVoucher: async (req, res, next) => {
    try {
      const vouchers = await Voucher.find({
        status: "active",
      });

      res.status(200).send({ vouchers });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  applyVoucher: async (req, res, next) => {
    try {
      const voucher = await Voucher.findOne({ code: req.body.voucherCode, status: "active" });

      if (!voucher)
        return res.status(404).send({ message: "Voucher not found." });

      if (req.body.totalProductPrice < voucher.minOrderValue) return res.status(400).send({message: "Your order is not enough to use this voucher."});

      let discountValue = voucher.value;

      if (voucher.type === "percent") {
        discountValue = (req.body.totalProductPrice * voucher.value) / 100;
        discountValue =
          discountValue > voucher.maxDiscountValue
            ? voucher.maxDiscountValue
            : discountValue;
      }

      res.status(200).send({
        voucher: { ...voucher._doc, discountValue: discountValue },
        message: "Apply voucher success",
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = voucherController;
