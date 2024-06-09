const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: "top180802@gmail.com",
                pass: process.env.GMAIL_PASSWORD,
            },
        });
        await transporter.sendMail({
            from: "T&T SHOP <top180802@gmail.com>",
            to: `${to.name} <${to.email}>`,
            subject,
            html,
            replyTo: "T&T SHOP <top180802@gmail.com>",
        });
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { sendEmail };

