/** @format */

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const userRouter = require("./routers/userRoutes");
const PostRouter = require("./routers/PostRoutes");
const nba = require("nba");

//app.use(morgan("dev"));

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  //timestamp every req
  req.body.requestTime = Date.now();
  next();
});

//subrouters
app.use("/api/users", userRouter);
app.use("/api/posts", PostRouter);

module.exports = app;
