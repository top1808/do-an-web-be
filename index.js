const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./src/config/database");
const firebase = require("./src/config/firebase");
const pusher = require("./src/config/pusher");
const nodeSchedule = require("./src/config/nodeSchedule");
const adminRoutes = require("./src/app/admin");
const customerRoutes = require("./src/app/customer");
const webRoutes = require("./src/app/web");

require("dotenv").config();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:8000",
      "https://do-an-web-be.onrender.com",
      "https://do-an-web-fe-git-main-top1808s-projects.vercel.app",
      "https://do-an-web-fe-user-git-main-top1808s-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "30mb" }));
app.use(express.static("public"));

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));

// Website routes

app.use("/v1", adminRoutes);
app.use("/v2", customerRoutes);
app.use("/", webRoutes);

app.listen(process.env.PORT, function () {
  console.log("Starting at port 8000...");
});
