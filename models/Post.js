/** @format */

const mongoose = require("mongoose");
const User = require("./User");
const nbaAPI = require("../controllers/nbaAPIHandler");

const PostSchema = new mongoose.Schema({
  timeCreated: {
    type: Date,
    required: true,
  },
  text: {
    type: String,
    required: [true, "Post must have some text"],
  },
  nbaContentType: {
    type: String,
    enum: ["Player", "Team"],
    required: true,
  },
  nbaPlayerOrTeamName: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  statsPoints: Number,
  statsRebounds: Number,
  statsAssists: Number,
  statsWins: Number,
  statsLosses: Number,
  statsPercentWin: Number,
  statsConfRank: Number,
});

PostSchema.set("toObject", { virtuals: true });
PostSchema.set("toJSON", { virtuals: true });

PostSchema.pre("save", async function () {
  const author = this.author;
  const authorDoc = await User.findById(author);
  authorDoc.posts.push(this._id); //update author
  await authorDoc.save();

  if (this.nbaContentType === "Player") {
    //add nba stat data
    const stats = await nbaAPI.getBigThreeByName(this.nbaPlayerOrTeamName);
    this.statsPoints = stats.points;
    this.statsAssists = stats.assists;
    this.statsRebounds = stats.rebounds;
  } else {
    const stats = await nbaAPI.getTeamData(this.nbaPlayerOrTeamName);
    this.statsWins = stats.wins;
    this.statsLosses = stats.losses;
    this.statsPercentWin = stats.percentWin;
    this.statsConfRank = stats.conferenceRank;
  }
});

PostSchema.pre("remove", async function () {
  const author = this.author;
  const authorDoc = await User.findById(author);
  //console.log(authorDoc.posts);
  authorDoc.posts = authorDoc.posts.filter(function (el) {
    return el !== this._id;
  });
  // console.log(authorDoc.posts);
  await authorDoc.save();
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
