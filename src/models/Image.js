const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    name: {
        type: String,
    },
    data: {
        type: String,
    },
    path: {
        type: String,
    }
}, { timestamps: true});

module.exports = mongoose.model('Image', imageSchema);