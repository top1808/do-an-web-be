const ORDER_STATUS = [
  "processing",
  "confirmed",
  "delivering",
  "delivered",
  "received",
  "canceled",
];

const CURRENT_DATE = new Date().toISOString().split("T")[0];

module.exports = {
  ORDER_STATUS,
  CURRENT_DATE
};
