const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1743566",
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "ap1",
  useTLS: true,
});

module.exports = pusher;
