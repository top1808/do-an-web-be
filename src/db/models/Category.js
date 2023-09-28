const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
    }]
}, { timestamps: true});

module.exports = mongoose.model('Category', categorySchema);