const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: true,
    },
    categoryIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
    }],
}, { timestamps: true});

productSchema.virtual('categoryList', {
    ref: 'Category',
    localField: "categoryIds",
    foreignField: '_id',
})

module.exports = mongoose.model('Product', productSchema);