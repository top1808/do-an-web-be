const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voucherSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    maxDiscountValue: {
      type: Number,
    },
    minOrderValue: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    quantityUsed: {
      type: Number,
      default: 0,
    },
    quantityLeft: {
      type: Number,
    },
    dateStart: {
      type: String,
      required: true,
    },
    dateEnd: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: true,
    },
  },
  { timestamps: true }
);

voucherSchema.pre("updateOne", async function (done) {
  const update = this.getUpdate();
  if (update && update.$inc && update.$inc.quantityUsed) {
    const quantityUsed = update.$inc.quantityUsed;
    const docToUpdate = await this.model.findOne(this.getQuery());

    if (docToUpdate) {
      const quantity = docToUpdate.quantity;
      update.$set.quantityLeft = quantity - quantityUsed;
    }
  }
  done();
});

module.exports = mongoose.model("Voucher", voucherSchema);
