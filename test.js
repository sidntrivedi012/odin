const Octokit = require("@octokit/rest");
require("dotenv").config();
const octokit = new Octokit({
  auth: process.env.GITHUB_API_KEY
});
var fs = require("fs");
var res = {};

function getLeaderboard() {
  octokit.repos.listForOrg({ org: "osdc" }).then(repos => {
    repos.data.forEach(({ name }) => {
      octokit.repos.listCommits({ owner: "osdc", repo: name }).then(commits => {
        commits.data.forEach(commit => {
          console.log(commit.commit.author.name);
        });
      });
    });
  });
}
getLeaderboard();
// fs.readFile("./commits.json", "utf-8", (err, data) => {
//   var res = JSON.parse(data);
//   res.data.forEach(commit => {
//     console.log(commit.commit.author.name);
//   });
// });
