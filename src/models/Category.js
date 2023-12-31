const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: true,
    },
}, { timestamps: true});

module.exports = mongoose.model('Category', categorySchema);