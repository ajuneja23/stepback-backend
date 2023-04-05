/** @format */

//libs
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//model
const User = require("../models/User");
const { promisify } = require("util");
const verifyPassword = async (candidatePassword, realPassword) => {
  try {
    //console.log("verifying 🍎");
    //console.log(candidatePassword);
    //console.log(realPassword);
    const result = await bcrypt.compare(candidatePassword, realPassword);
    //console.log(result);
    return result;
  } catch (err) {
    return err;
  }
};

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

exports.signUp = async (req, res) => {
  try {
    console.log("signup");
    const user = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      posts: [],
    });
    console.log(user);
    const token = signToken(user._id);
    return res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.find({
      email: email,
    })
      .select("+password")
      .populate("posts");
    console.log(user);
    if (!user || !(await verifyPassword(password, "" + user[0].password))) {
      throw "Invalid login";
    }
    //const token=signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    let token = "";
    //console.log(authorization);
    if (authorization && authorization.startsWith("Bearer ")) {
      token = authorization.split(" ")[1];
      //console.log(token);
    } else {
      throw err;
    }
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );
    //console.log(decodedToken);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      throw err;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: "Access denied",
    });
  }
};
