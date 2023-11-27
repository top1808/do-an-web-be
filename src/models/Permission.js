const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    method: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
}, { timestamps: true});

module.exports = mongoose.model('Permission', permissionSchema);