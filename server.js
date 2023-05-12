const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const regionRoute = require("./routes/regionRoute");
const officeRoute = require("./routes/officeRoute");
const roleRoute = require("./routes/roleRoute");
const userRoute = require("./routes/userRoute");
const menuItemRoute = require("./routes/menuItemRoute");
const settingRoute = require("./routes/settingRoute");
const authenticationRoute = require("./routes/authenticationRoute");
const logRoute = require("./routes/logRoute");
const customerRoute = require("./routes/customerRoute");
const saleTypeRoute = require("./routes/saleTypeRoute");
const currencyTypeRoute = require("./routes/currencyTypeRoute");
const saleRoute = require("./routes/saleRoute");

const app = express();

// middlewares
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://pdm-frontend-app.onrender.com/"],
    //origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("common"));

// Route middlewares
app.use("/api/region", regionRoute);
app.use("/api/office", officeRoute);
app.use("/api/role", roleRoute);
app.use("/api/user", userRoute);
app.use("/api/menu", menuItemRoute);
app.use("/api/setting", settingRoute);
app.use("/api/authentication", authenticationRoute);
app.use("/api/log", logRoute);
app.use("/api/customer", customerRoute);
app.use("/api/saletype", saleTypeRoute);
app.use("/api/currency", currencyTypeRoute);
app.use("/api/sale", saleRoute);

// Connect to MongoDB and start server
const port = process.env.APP_PORT || 8080;
try {
  mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(port, () => {
      console.log(`Backend server is up & running on port ${port}!`);
    });
  });
} catch (err) {
  console.log(err);
}
