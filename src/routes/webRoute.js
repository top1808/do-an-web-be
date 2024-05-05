const imageController = require("../controllers/imageController");
const upload = require("../middlewares/uploadMiddleware");
const fileUploader = require("../config/cloudinary");
const { redisClient } = require("../config/redis");

const webRoute = require("express").Router();

webRoute.post(
  "/cloudinary-upload",
  fileUploader.single("image"),
  imageController.uploadSingle
);
// webRoute.post('/cloudinary-upload-list', fileUploader.array('image', 10), imageController.uploadList);
// webRoute.post('/image/upload', upload.single('image'), imageController.resizeImage, imageController.uploadSingle);
// webRoute.post('/image/upload-list', upload.array('images', 10), imageController.resizeImage, imageController.uploadList);
webRoute.get("/image", imageController.getImages);
webRoute.get("/image/:id", imageController.getImage);

webRoute.post("/test-redis", async (req, res) => {
  const key = req.body.key;
  const value = req.body.value;
  const method = req.body.method;
  let valueRedis = "";
  if (method === "get") {
    valueRedis = await redisClient.get(key);
  } else {
    await redisClient.set(key, value);
  }
  return res.send("test redis: " + valueRedis);
});

module.exports = webRoute;
