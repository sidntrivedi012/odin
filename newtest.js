const Octokit = require("@octokit/rest");
const octokit = new Octokit();

function getLeaderboard() {
  octokit.repos.listForOrg({ org: "osdc" }).then(repos => {
    repos.forEach(({ name }) => {
      octokit.repos.listCommits({ owner: "osdc", repo: name }).then(commits => {
        commits.forEach(commit => {
          console.log(commit);
        });
      });
    });
  });
}

getLeaderboard();
