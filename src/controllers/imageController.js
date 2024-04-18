const Image = require("../models/Image");
const fs = require("fs-extra");
const sharp = require("sharp");

const imageController = {
  uploadSingle: async (req, res) => {
    try {
      const newImage = new Image(req.file);

      res
        .status(200)
        .send({
          message: "Upload image successfully.",
          image: newImage._doc.path,
        });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  uploadList: async (req, res) => {
    try {
      const newImage = new Image({
        ...req.file,
        path: req?.resizedImagePath,
      });
      await newImage.save();
      const pathImage =
        req.protocol + "://" + req.get("host") + "/" + req?.resizedImagePath;

      res
        .status(200)
        .send({ message: "Upload image successfully.", images: pathImage });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getImages: async (req, res) => {
    try {
      const images = await Image.find();

      res.status(200).send({ images });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getImage: async (req, res) => {
    try {
      const image = await Image.findById(req.params.id);

      const dataUrl = image._doc.path;

      res.status(200).send(dataUrl);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  resizeImage: async (req, res, next) => {
    try {
      const resizedImagePath = req.file.path.replace(/\.\w+$/, "_resized$&");
      console.log("🚀 ~ resizeImage: ~ resizedImagePath:", resizedImagePath);

      await sharp(req.file.path).resize(700, 700).toFile(resizedImagePath);

      req.resizedImagePath = resizedImagePath;
      next();
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = imageController;
