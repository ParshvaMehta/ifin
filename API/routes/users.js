"use strict";
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
const User = require("../model/user.model");
var constants = require("../constants");

async function getUserByEmailOrUserName({ email, username } = {}) {
  email = email ? email.toLowerCase() : email;
  username = username ? username.toLowerCase() : username;
  return User.findOne(
    { $and: [{ status: 1 }, { $or: [{ email }, { username }] }] },
    async (err, user) => {
      if (err) {
        return null;
      }
      return user;
    }
  );
}

/* [GET] - /user/all - users listing. */
router.route("/all").get((req, res) => {
  User.find({ status: 1 }, { hash: 0, salt: 0, __v: 0 }, (err, users) => {
    console.log(err);
    console.log(users);
    return res.send({ code: 200, users });
  });
});

/* [PUT] - /user/add -  Signup new USER */
router.route("/add").put(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.send({ code: 400, message: "require parameter missing!" });
  }
  const isExistingUser = await getUserByEmailOrUserName({ email, username });
  if (isExistingUser) {
    return res.send({ code: 400, message: "Email or UserName Already Exists" });
  }
  const user = new User({
    username: username.toLowerCase(),
    email: email.toLowerCase()
  });
  user.setPassword(password);
  user
    .save((err, user) => {
      if (err) {
        return res.send({ code: 500 });
      }
      return res.send({ code: 200, user });
    })
    .catch(error => {
      console.log(error);
      return res.send([{ error: error }]);
    });
});

/* [POST] - /user/signin -  Signing a USER */
router.route("/signin").post(async (req, res) => {
  const { username, email, password } = req.body;
  if ((!username && !email) || !password) {
    return res.send({
      code: 400,
      message: "Email or Username or Password is missing"
    });
  }
  const user = await getUserByEmailOrUserName({ email, username });
  if (!user) {
    return res.send({ code: 400, message: "User not found" });
  }
  if (user.validPassword(password)) {
    var token = jwt.sign(
      {
        algorithm: "RS512",
        data: { email: user.email, username: user.username, id: user._id },
        exp: Math.floor(Date.now() / 1000) + 60 * 60
      },
      constants.JWT_SECRET
    );

    user.hash = undefined;
    user.salt = undefined;
    user.__v = undefined;
    return res.send({ code: 200, user, token });
  }
  return res.send({ code: 400, message: "Password not matched" });
});

module.exports = router;
