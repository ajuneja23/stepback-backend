/** @format */

const express = require("express");

const router = express.Router();

//controllers
const userController = require("../controllers/userControllers");
const authController = require("../controllers/authController");

router.route("/").get(userController.getAllUsers);

router.route("/signup").post(authController.signUp);

router.route("/login").post(authController.login);

router
  .route("/:userid")
  .get(userController.getUser)
  .delete(authController.protect, userController.deleteUser);
module.exports = router;
