const { sendEmail } = require("../config/nodemailer");
const CancelOrderTemplate = require("../templates/email/CancelOrderEmail.template");
const ConfirmOrderTemplate = require("../templates/email/ConfirmOrderEmail.template");
const DeliveredOrderTemplate = require("../templates/email/DeliveredOrderEmail.template");
const DeliveringOrderTemplate = require("../templates/email/DeliveringOrderEmail.template");
const ReceivedOrderEmailTemplate = require("../templates/email/ReceivedOrderEmail.template");
const inventoryService = require("./inventoryService");

const orderService = {
  async handleMultipleRequest(product, res) {
    try {
      const inventory = await inventoryService.checkProductInventory(product);

      // const keyName = product["productSKUBarcode"];

      // const getKey = await redisClient.exists(keyName);

      // if (!getKey) {
      //   await redisClient.set(keyName, 0);
      // }

      // let soldQuantity = await redisClient.get(keyName);
      if (product["quantity"] > inventory["inventory"]["currentQuantity"]) {
        return {
          status: false,
          product,
        };
      }
      // // Xu ly ban qua hang ton kho
      // soldQuantity = await redisClient.incrBy(keyName, product["quantity"]);
      // if (soldQuantity > inventory["inventory"]["currentQuantity"]) {
      //   await redisClient.set(
      //     "banqua",
      //     soldQuantity - inventory["inventory"]["currentQuantity"]
      //   );
      //   return {
      //     status: false,
      //   };
      // }
      return {
        status: true,
      };
    } catch (err) {
      console.log("🚀 ~ handleMultipleRequest ~ err:", err);
    }
  },

  async sendOrderEmail(status, dataEmail) {
    let html = null;
    let subject = "";
    switch (status) {
      case "confirmed":
        subject = "Đơn hàng của bạn đã được xác nhận."
        html = ConfirmOrderTemplate(dataEmail)
        break;
      case "delivering":
        subject = "Đơn hàng của bạn đang được giao."
        html = DeliveringOrderTemplate(dataEmail)
        break;
      case "delivered":
        subject = "Đơn hàng của bạn đã giao đến địa chỉ của bạn."
        html = DeliveredOrderTemplate(dataEmail)
        break;
      case "received":
        subject = "Cảm ơn bạn đã mua hàng bên chúng tôi."
        html = ReceivedOrderEmailTemplate(dataEmail)
        break;
      case "canceled":
        subject = "Đơn hàng của bạn đã bị hủy."
        html = CancelOrderTemplate(dataEmail)
        break;
      default:
        break;
    }
    if (html) {
      await sendEmail({
        to: {
          name: dataEmail.customerName,
          email: dataEmail.customerEmail,
        }, subject, html
      })
    }
  }

};

module.exports = orderService;
