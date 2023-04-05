/** @format */
const mongoose = require("mongoose");
const app = require("./app.js");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

//mongo connection
mongoose
  .connect(process.env.MONGO_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB 😍");
  });

//server start
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT} 😊`);
});
