const ORDER_STATUS = [
  "processing",
  "confirmed",
  "delivering",
  "delivered",
  "received",
  "canceled",
];

const CUSTOMER_STATUS = ["active", "inactive", "locked"];

const CURRENT_DATE = new Date().toLocaleString("vi-VN").split(" ")[1];
const CURRENT_TIME = new Date().toLocaleString("vi-VN").split(" ")[0];

const PAYMENT_METHOD = {
  cash: "Thanh toán bằng tiền mặt"
}

module.exports = {
  ORDER_STATUS,
  CURRENT_DATE,
  CURRENT_TIME,
  CUSTOMER_STATUS,
  PAYMENT_METHOD,
};
