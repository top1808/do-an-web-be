const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    promotionPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

cartSchema.pre("updateOne", async function (done) {
  const update = this.getUpdate();
  if (update && update.$set.quantity) {
    const quantity = update.$set.quantity;
    const docToUpdate = await this.model.findOne(this.getQuery());

    if (docToUpdate) {
      const price = docToUpdate.price;
      const totalPrice = quantity * price;
      update.$set.totalPrice = totalPrice;
    }
  }
  done();
});

cartSchema.virtual("cusId", {
  ref: "Customer",
  localField: "customerId",
  foreignField: "id",
});

cartSchema.virtual("proId", {
  ref: "Product",
  localField: "product",
  foreignField: "_id",
});

module.exports = mongoose.model("Cart", cartSchema);
