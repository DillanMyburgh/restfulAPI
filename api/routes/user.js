const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User email already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created succesfully",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

router.get("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              id: user._id,
              email: user.email,
            },
            process.env.JWT,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth succesful",
            key: token,
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findOneAndDelete({ _id: userId })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Deleted user",
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then((result) => {
      console.log(result);
      res.status(200).json({
        user: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/", (req, res, next) => {
  User.find()
    .select("email _id")
    .then((result) => {
      console.log(result);
      res.status(200).json({
        user: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
