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
    category_ids: {
        type: Array,
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    },
    // catego: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Category',
    // }]
}, { timestamps: true});

module.exports = mongoose.model('Product', productSchema);