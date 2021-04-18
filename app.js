const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');

const spendingsRoutes = require("./api/routes/spendings");
const userRoutes = require('./api/routes/user');

mongoose.connect("mongodb+srv://@calendarapp.r9xuy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { user: "Alex", pass: "0933002090", useNewUrlParser: true, useUnifiedTopology: true })

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).json({});
  }
  next();
});

app.use("/spendings", spendingsRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found now");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
