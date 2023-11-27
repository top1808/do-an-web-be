const mongoose = require('mongoose');
const { validateEmail } = require('../utils/regex');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    }
}, { timestamps: true});

userSchema.virtual('rId', {
    ref: 'Role',
    localField: "roleId",
    foreignField: '_id',
})

module.exports = mongoose.model('User', userSchema);