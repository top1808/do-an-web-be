const jwt = require('jsonwebtoken');

const middlewareController = {
    //verify token
    verifyToken: (req, res, next) => {
        const accessToken = req.header('authorization')?.split(" ")[1];
        if (accessToken) {
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).send({message: "Token is invalid."})
                }
                req.user = user.user;
                next();
            })
        } else {
            res.status(401).send({message: "You are not authenticated."})
        }
    },
    checkRole: async (req, res, next) => {
        next();
    }
}

module.exports = middlewareController;