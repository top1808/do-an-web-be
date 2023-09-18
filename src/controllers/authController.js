const bcrypt = require('bcrypt');
const User = require('../db/models/User');

const authController = {
    //REGISTER
    registerUser: async (req, res, next) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            const newUser = new User({
                ...req.body,
                password: hashed
            })

            const user = await newUser.save();

            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //LOGIN
    loginUser: async (req, res, next) => {
        try {
            const user = await User.findOne({username: req.body.username});
            if (!user) {
                return res.status(404).json('Username is wrong.')
            }
            
            const checkPass = await bcrypt.compare(req.body.password, user.password);
            if (!checkPass) {
                return res.status(404).json('Password is wrong.')
            }

            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = authController;