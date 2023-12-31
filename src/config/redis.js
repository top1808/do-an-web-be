const { createClient } = require("redis");

const redisClient = createClient();

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});

module.exports = redisClient;
