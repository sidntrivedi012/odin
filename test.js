const Octokit = require("@octokit/rest");
require("dotenv").config();
const octokit = new Octokit({
  auth: process.env.GITHUB_API_KEY
});
var fs = require("fs");
var obj = [
  {
    contributor: "name",
    commits: 0
  }
];
var f = 0;
function getLeaderboard() {
  octokit.repos.listForOrg({ org: "osdc" }).then(repos => {
    repos.data.forEach(({ name }) => {
      octokit.repos.listCommits({ owner: "osdc", repo: name }).then(commits => {
        commits.data.forEach(commit => {
          var osdcian = commit.commit.author.name;
          var osdcian_data = {
            contributor: commit.commit.author.name,
            commits: 1
          };
          let temp = obj.find(e => e.contributor === osdcian);
          if (temp != undefined) {
            temp.commits += 1;
          } else {
            obj.push(osdcian_data);
          }
          fs.writeFile("final.json", JSON.stringify(obj), function(err) {
            if (err) throw err;
          });
        });
      });
    });
  });
}
getLeaderboard();
