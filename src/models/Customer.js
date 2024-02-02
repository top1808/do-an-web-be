const mongoose = require("mongoose");
const { validateEmail } = require("../utils/regex");

const customerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
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
      validate: [
        (email) => {
          if (email === "") return true;
          return validateEmail(email);
        },
        "Please fill a valid email address",
      ],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      max: 10,
      default: "",
    },
    lastLogin: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
