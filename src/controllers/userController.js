const User = require("../db/models/User");

const userController = {
    //getAllUser
    getAll: async ( req, res, next) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //deleteUser
    deleteUser: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            user.deleteOne();
            res.status(200).json("Delete user successfully.");
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController;