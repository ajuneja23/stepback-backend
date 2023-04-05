/** @format */

const mongoose = require("mongoose");
const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      author: req.user._id,
      timeCreated: Date.now(),
      text: req.body.text,
      nbaContentType: req.body.nbaContentType,
      nbaPlayerOrTeamName: req.body.nbaPlayerOrTeamName,
    });
    const populatedPost = await post.populate("author");
    console.log(populatedPost);
    res.status(201).json({
      status: "success",
      data: {
        populatedPost,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const id = req.params.postid;
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      throw "No post found";
    }
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      error: err,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const filterObj = {};
    if (req.query.nbaPlayerOrTeamName) {
      filterObj["nbaPlayerOrTeamName"] = req.query.nbaPlayerOrTeamName;
    }
    if (req.query.author) {
      filterObj["author"] = req.query.author;
    }
    const posts = await Post.find(filterObj).populate("author");
    res.status(200).json({
      status: "success",
      data: {
        posts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      data,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const id = req.params.postid;
    const post = await Post.findById(id).populate("author");
    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err,
    });
  }
};
