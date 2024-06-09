const jwt = require("jsonwebtoken");

const authService = {
    createVerifyEmailUrl: async (user) => {
        const token = jwt.sign(
            {
                email: user?.email,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "1h" }
        );

        return `${process.env.DOMAIN_FE_SALE}/verify-email?token=${token}`
    },

    checkToken: async (token) => {
        const user = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        return user;
    },
}

module.exports = authService;