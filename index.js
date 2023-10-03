const express = require("express");
const bodyParser = require("body-parser");

const Database = require("./src/db/database");
// const Nacl = require("./src/config/nacl");
// const routes = require('./src/routes/controller');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const acl = require("express-acl");
acl.config({
  baseUrl: "v1",
  filename: "nacl.json",
  path: "src/config",
  decodedObjectName: 'user'
});

const authRoute = require("./src/routes/auth");
const userRoute = require("./src/routes/user");
const categoryRoute = require("./src/routes/category");
const productRoute = require("./src/routes/product");
const middlewareController = require("./src/controllers/middlewareController");

require("dotenv").config();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));

// Website routes
app.use("/v1/auth", authRoute);

app.use(middlewareController.verifyToken, middlewareController.checkRole);
app.use(acl.authorize);

app.use("/v1/user", userRoute);
app.use("/v1/category", categoryRoute);
app.use("/v1/product", productRoute);

app.listen(process.env.PORT, function () {
  console.log("Starting at port 8000...");
});
