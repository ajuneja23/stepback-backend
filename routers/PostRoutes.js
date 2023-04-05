/** @format */

const express = require("express");

const router = express.Router();

//controllers
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(postController.getAllPosts)
  .post(authController.protect, postController.createPost);

router
  .route("/:postid")
  .delete(authController.protect, postController.deletePost)
  .get(postController.getPost);
module.exports = router;
