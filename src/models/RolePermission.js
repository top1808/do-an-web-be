const mongoose = require('mongoose');

const rolePermissionSchema = new mongoose.Schema({
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    permissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    },
}, { timestamps: true});

rolePermissionSchema.virtual('pId', {
    ref: 'Permission',
    localField: "permissionId",
    foreignField: '_id',
})
rolePermissionSchema.virtual('rId', {
    ref: 'Role',
    localField: "roleId",
    foreignField: '_id',
})

module.exports = mongoose.model('Role_Permission', rolePermissionSchema);