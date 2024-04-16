const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    fieldname: {
        type: String,
    },
    originalname: {
        type: String,
    },
    encoding: {
        type: String,
    },
    mimetype: {
        type: String,
    },
    destination: {
        type: String,
    },
    filename: {
        type: String,
    },
    path: {
        type: String,
    },
    size: {
        type: Number,
    }
}, { timestamps: true});

module.exports = mongoose.model('Image', imageSchema);