const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    price: {
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
    discountProgramId: {
        type: Schema.Types.ObjectId,
        ref: 'DiscountProgram',
    }
}, { timestamps: true});

productSchema.virtual('categoryList', {
    ref: 'Category',
    localField: "categoryIds",
    foreignField: '_id',
})

productSchema.virtual('discountProgramDetails', {
    ref: 'DiscountProgram',
    localField: "discountProgramId",
    foreignField: '_id',
})

module.exports = mongoose.model('Product', productSchema);