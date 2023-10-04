const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissionIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
    }]
}, { timestamps: true});

roleSchema.virtual('permissionList', {
    ref: 'Permission',
    localField: "permissionIds",
    foreignField: '_id',
})

module.exports = mongoose.model('Role', roleSchema);