const mongoose = require('mongoose');

const refreshToken = new mongoose.Schema({
    token: {
        type: String,
    },
}, { timestamps: true});

module.exports = mongoose.model('RefreshToken', refreshToken);