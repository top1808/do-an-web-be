const ORDER_STATUS = [
  "processing",
  "confirmed",
  "delivering",
  "delivered",
  "received",
  "canceled",
];

const CURRENT_DATE = new Date().toLocaleString("vi-VN").split(" ")[1];
const CURRENT_TIME = new Date().toLocaleString("vi-VN").split(" ")[0];

module.exports = {
  ORDER_STATUS,
  CURRENT_DATE,
};
