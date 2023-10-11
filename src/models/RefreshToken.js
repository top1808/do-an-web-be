const mongoose = require('mongoose');

const refreshToken = new mongoose.Schema({
    token: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true});

refreshToken.virtual('user_id', {
    ref: 'User',
    localField: "userId",
    foreignField: '_id',
})

module.exports = mongoose.model('RefreshToken', refreshToken);