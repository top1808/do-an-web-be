const Image = require("../models/Image");
const fs = require("fs-extra");

const imageController = {
  uploadSingle: async (req, res) => {
    try {
      const { fileName, path, mimetype } = req.file;
      const imageBuffer = fs.readFileSync(path);

      const base64Image = imageBuffer.toString("base64");
      const dataUrl = `data:${mimetype};base64,${base64Image}`;

      const newImage = new Image({
        name: fileName,
        data: dataUrl,
      });
      await newImage.save();

      res
        .status(200)
        .send({ message: "Upload image successfully.", image: newImage });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  uploadList: async (req, res) => {
    try {
      const { fileName, path, mimetype } = req.files[0];
      const imageBuffer = fs.readFileSync(path);

      const base64Image = imageBuffer.toString("base64");
      const dataUrl = `data:${mimetype};base64,${base64Image}`;

      const newImage = new Image({
        name: fileName,
        data: dataUrl,
      });
      await newImage.save();

      res
        .status(200)
        .send({ message: "Upload image successfully.", images: newImage });
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

      res.status(200).send({ image });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = imageController;
