/** @format */

//libs
const mongoose = require("mongoose");

//model
const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("posts");
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: "Error occurred",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = req.params.userid;
    const user = await User.findById(id).populate("posts");
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: "error occurred",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.user._id;
    await User.findByIdAndDelete(id);
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: "Deletion failed",
    });
  }
};
