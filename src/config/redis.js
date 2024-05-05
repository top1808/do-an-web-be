const { createClient } = require("redis");

const config = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  // db: process.env.REDIS_DB,
  connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT) || 30000,
};

const redisClient = createClient(config);

redisClient.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("reconnecting", () => {
  console.log("Reconnecting to Redis");
});

redisClient.on("end", () => {
  console.log("Disconnected from Redis");
});

const initRedis = async () => {
  await redisClient.connect();
};

module.exports = {
  redisClient,
  initRedis,
};
