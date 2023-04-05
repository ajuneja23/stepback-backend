/** @format */

const mongoose = require("mongoose");
const bcryptjs = require("bcrypt");
const validator = require("validator");
//const Post = require("./Post");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "An email is required"],
    unique: [true, "Email already in use"],
    validate: {
      validator: validator.isEmail,
      message: "Not a valid email",
    },
  },
  name: {
    type: String,
    required: [true, "A name is required"],
    unique: [true, "Name already is use"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (pswrdConfirm) {
        return pswrdConfirm === this.password;
      },
      message: "Passwords do not match",
    },
  },
  posts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    required: true, //array of posts
  },
});

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 12);
    this.passwordConfirm = undefined; //deletes field
  }
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
