const express = require("express");
const router = express.Router();
const bcrpyt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Required fields not found" });
  }

  //Check for existing user
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: "Email already in use!" });
    }

    const newUser = new User({
      username,
      email,
      password,
      rank: 100000,
    });

    //Create salt & hash
    const saltRounds = 10;
    bcrpyt.genSalt(saltRounds, () => {
      bcrpyt.hash(newUser.password, saltRounds, (err, hash) => {
        if (err) {
          throw err;
        }
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { username: user.username },
            config.get("jwtSecret"),
            {
              expiresIn: 604800,
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
  });
});

module.exports = router;
