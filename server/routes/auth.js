const express = require("express");
const router = express.Router();
const bcrpyt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");

const User = require("../models/User");

router.post("/", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Required fields not found" });
  }

  //Check for existing user
  User.findOne({ username }).then((user) => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    //Create salt & hash
    const saltRounds = 10;

    //Validate password
    bcrpyt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      jwt.sign(
        { username: user.username },
        config.get("jwtSecret"),
        {
          expiresIn: 100,
        },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({
            token,
            user: {
              username: user.username,
              name: user.name,
              email: user.email,
            },
          });
        }
      );
    });
  });
});

router.get("/user", authMiddleware, (req, res) => {
  User.findOne({ username: req.user.username })
    .select("-password")
    .then((user) => res.json(user));
});

module.exports = router;
