const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const RolePermission = require("../models/RolePermission");

const middlewareController = {
  //verify token
  verifyToken: (req, res, next) => {
    const accessToken = req.header("authorization")?.split(" ")[1];
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).send({ message: "Token is invalid." });
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).send({ message: "You are not authenticated." });
    }
  },
  checkPermission: async (req, res, next) => {
    try {
      const method = req.method.toLowerCase();
      const userId = req.user?._id;

      let url = "/" + req.url.split("/")[1];
      if (url === "/authorize") {
        url = "/" + req.url.split("/")[2];
      }
      if (url.includes("?")) url = url.split("?")[0];
      const permission = await Permission.findOne({ method: method, url: url });

      if (!permission) return next();
      const user = await User.findById(userId);
      if (!user)
        res.status(401).send({ message: "You are not authenticated." });

      const hasPermission = await RolePermission.findOne({
        roleId: user.roleId,
        permissionId: permission._id,
      });

      if (!hasPermission) {
        return res.status(405).send({ message: "You are not allowed." });
      }

      next();
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = middlewareController;
