const rp = require("request-promise");
const $ = require("cheerio");
const xkcd = (bot, msg) => {
  //getting message string
  let args = msg.text.split(" ");
  const chatId = msg.chat.id;
  //xkcd script
  if (args[0] == "/xkcd") {
    let max = 3000;
    let min = 0;
    let index = Math.floor(Math.random() * (+max - +min)) + +min;
    const url = "https://xkcd.com/" + index;
    console.log(url);

    rp(url)
      .then(function(html) {
        //success!
        let strip = $("#comic > img", html)[0].attribs.src;
        strip = "https:" + strip;
        console.log(strip);

        bot.sendPhoto(chatId, strip);
      })
      .catch(function(err) {
        //handle error
        bot.sendPhoto(
          chatId,
          "https://imgs.xkcd.com/comics/angular_momentum.jpg"
        );
        console.log("error");
      });
  }
};
module.exports = xkcd;
