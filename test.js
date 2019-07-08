const Octokit = require("@octokit/rest");
const octokit = new Octokit();
var fs = require("fs");
var repos = [];
octokit.repos
  .listForOrg({
    org: "osdc"
  })
  .then(({ data }) => {
    for (var i = 0; i < data.length; i++) {
      repos[i] = data[i].name;
    }
    fs.writeFile("repos.json", JSON.stringify(data), "utf-8", err => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
      getCommits();
    });
  });

// Compare: https://developer.github.com/v3/repos/#list-organization-repositories
function getCommits() {
  //   for (var i = 0; i < repos.length; i++) {
  console.log("in loop");

  octokit.repos
    .listCommits({
      owner: "osdc",
      repo: repos[1]
    })
    .then(({ data }) => {
      console.log(data);
      fs.writeFile("commits.json", JSON.stringify(data), "utf-8", err => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
      });
    });
}
// }
