const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const spendingsRoutes = require("./api/routes/spendings");

mongoose.connect(
  "mongodb+srv://Alex:" +
    process.env.MONGO_ATLAS_PW +
    "@calendarapp.r9xuy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useMongoClient: true,
  }
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

app.use("/spendings", spendingsRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
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