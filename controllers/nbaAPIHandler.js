/** @format */

const nba = require("nba");
const getJSON = require("nba/src/get-json");

exports.getBigThreeByName = async (playerName) => {
  try {
    const playerID = (await nba.findPlayer(playerName)).playerId;
    const statistics = await nba.stats.playerInfo({ PlayerID: playerID });
    //console.log(statistics.playerHeadlineStats);
    const bigThree = {
      points: statistics.playerHeadlineStats[0].pts,
      assists: statistics.playerHeadlineStats[0].ast,
      rebounds: statistics.playerHeadlineStats[0].reb,
      name: statistics.playerHeadlineStats[0].playerName,
    };
    return bigThree;
  } catch (err) {
    return "API failed";
  }
};

exports.getTeamData = async (teamName) => {
  try {
    const teamID = await nba.teamIdFromName(teamName);
    const teamInfo = await nba.stats.teamInfoCommon({
      LeagueID: "00",
      Season: "2022-23",
      SeasonType: "Regular Season",
      TeamID: teamID,
    });
    const filteredTeamInfo = {
      wins: teamInfo.teamInfoCommon[0].w,
      losses: teamInfo.teamInfoCommon[0].l,
      teamName:
        teamInfo.teamInfoCommon[0].teamCity +
        " " +
        teamInfo.teamInfoCommon[0].teamName,
      percentWin: teamInfo.teamInfoCommon[0].pct,
      conferenceRank: teamInfo.teamInfoCommon[0].confRank,
    };
    return filteredTeamInfo;
  } catch (err) {
    return "API Failed";
  }
};
