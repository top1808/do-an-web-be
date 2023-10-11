const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
}, { timestamps: true});

cartSchema.virtual('cusId', {
    ref: 'User',
    localField: "customerId",
    foreignField: '_id',
});

cartSchema.virtual('proId', {
    ref: 'Product',
    localField: "productId",
    foreignField: '_id',
});

module.exports = mongoose.model('Cart', cartSchema);