const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require('../midlleware/check-auth');

const Spending = require("../models/spending");

router.get("/:userId", checkAuth, (req, res, next) => {
  Spending.find({userId: req.params.userId})
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length >= 0) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({
          message: "No entries found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/:userId", checkAuth, (req, res, next) => {
  const spending = new Spending({
    _id: new mongoose.Types.ObjectId(),
    category: req.body.category,
    amount: req.body.amount,
    date: req.body.date,
    userId: req.params.userId
  });
  spending
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handing POST requests to /spendings",
        createProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:spendingId", checkAuth, (req, res, next) => {
  const id = req.params.spendingId;
  Spending.findById(id)
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "NO valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:spendingId", checkAuth, (req, res, next) => {
  const id = req.params.spendingId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Spending.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:spendingId", checkAuth, (req, res, next) => {
  const id = req.params.spendingId;
  Spending.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
