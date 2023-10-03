const bcrypt = require('bcrypt');
const User = require('../db/models/User');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../db/models/RefreshToken');

const authController = {
    //GENERATE TOKEN
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                user: user,
            },
            process.env.JWT_ACCESS_KEY,
            {expiresIn: "30s"}
        );
    },
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                user: user,
            },
            process.env.JWT_REFRESH_KEY,
            {expiresIn: "1d"}
        )
    },
    //REGISTER
    registerUser: async (req, res, next) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            const newUser = new User({
                ...req.body,
                password: hashed,
            })

            const user = await newUser.save();

            res.status(200).send({user, message: "Register successful."});
        } catch (err) {
            res.status(500).send(err);
        }
    },
    //LOGIN
    loginUser: async (req, res, next) => {
        try {
            const user = await User.findOne({username: req.body.username});
            if (!user) {
                return res.status(401).send({message: 'Username is wrong.'})
            }
            
            const checkPass = await bcrypt.compare(req.body.password, user.password);
            if (!checkPass) {
                return res.status(401).send({message: 'Password is wrong.'})
            }

            const {password, username, ...rest} = user._doc;
            const accessToken = authController.generateAccessToken(user._doc);
            const refreshToken = authController.generateRefreshToken(user._doc);
            const newRefreshToken = new RefreshToken({token: refreshToken});
            await newRefreshToken.save();

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
                secure: true,
                sameSite: "strict",
                path: '/',
            })

            res.status(200).send({...rest, accessToken});
        } catch (err) {
            res.status(500).send(err);
        }
    },

    //REFRESH TOKEN
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).send({message: 'You are not authenticated'});

        const checkRefreshToken = await RefreshToken.findOne({ token: refreshToken});
        if (!checkRefreshToken) return res.status(403).send({message: 'Refresh Token is not valid.'});

        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (error, user) => {
            if (error) return res.status(403).send({error});

            checkRefreshToken.deleteOne();

            const newAccessToken = authController.generateAccessToken(user.user);
            const newRefreshToken = authController.generateRefreshToken(user.user);

            const saveRefreshToken = new RefreshToken({token: newRefreshToken});
            await saveRefreshToken.save();

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
                secure: true,
                sameSite: "strict",
                path: '/'
            })

            res.status(200).send({accessToken: newAccessToken});
        })
    },

    //LOGOUT
    logout: async (req, res) => {
        res.cookie("refreshToken", "");
        const refreshToken = await RefreshToken.findOne({token: req.cookies.refreshToken});
        await refreshToken.deleteOne();
        
        res.status(200).send({message: 'Logout successfully.'});

    }
}

module.exports = authController;