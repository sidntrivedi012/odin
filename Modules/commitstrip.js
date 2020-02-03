const rp = require("request-promise");
const $ = require("cheerio");
const cstrip = (bot, msg) => {
  //getting message string
  let args = msg.text.split(" ");
  const chatId = msg.chat.id;
  //xkcd script
  if (args[0] == "/commitstrip") {
    const url = "http://www.commitstrip.com/?random=1";
    rp(url)
      .then(html => {
        //success!
        let postid = $("article", html).attr("id");
        postid = "#" + postid;
        let strip = $(`${postid} > div > p > img`, html)[0].attribs.src;
        console.log(strip);
        bot.sendPhoto(chatId, strip);
      })
      .catch(function(err) {
        //handle error
        bot.sendPhoto(
          chatId,
          "https://www.commitstrip.com/wp-content/uploads/2020/01/Strip-Pull-request-sans-tester-650-finalenglishV2.jpg"
        );
        console.log("error");
      });
  }
};
module.exports = cstrip;
