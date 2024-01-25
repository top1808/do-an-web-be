const orderService = {
  notificationOrderStatus: (data) => {
    if (data?.status === "confirmed") {
      return {
        title: "Order notification",
        body:
          (req.user?.name || "No name") +
          " confirmed order " +
          data["orderCode"],
        image: "",
        link: "/order",
        fromUserId: req.user?._id,
        toUserId: "admin",
      };
    }
  },
};

module.exports = orderService;
