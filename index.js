const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const rp = require("request-promise");
const $ = require("cheerio");
const quotes = require("./static/quotes.json");
require("dotenv").config();
var assert = require("assert");

require("dotenv").config();
assert(
  process.env.MEETUP_API_KEY,
  "MEETUP_KEY variable isn't set on enviroment (use 'set 'MEETUP_KEY=key'' on Windows)"
);
var meetupslist;

var meetup = require("./node_modules/meetup-api/lib/meetup")({
  key: process.env.MEETUP_API_KEY
});

var communities = [
  "ILUG-D",
  "Golang Gurgaon",
  "LinuxChix India",
  "PyData Delhi",
  "Pydelhi",
  "Mozilla Delhi/NCR",
  "GDG New Delhi",
  "Paytm-Build for India",
  "JSLovers",
  "GDG Cloud New Delhi",
  "React Delhi/NCR"
];
let urls = [
  "ilugdelhi",
  "Gurgaon-Go-Meetup",
  "LinuxChix-India-Meetup",
  "PyDataDelhi",
  "pydelhi",
  "Mozilla_Delhi",
  "GDGNewDelhi",
  "Paytm-Build-for-India",
  "jslovers",
  "gdgcloudnd",
  "React-Delhi-NCR"
];

const token = process.env.TELEGRAM_API_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.onText(/\/heylisa/, msg => {
  //heylisa script
  var out =
    "Hey, I am Lisa. I am neither related to Apple nor NASA. You can interact with me using the following commands:\n";
  var c0 = "/meetups - Find a list of upcoming meetups in NCR.\n";
  var c1 = "/xkcd - I will send an awesome xkcd script all your way.\n";
  var c2 = "/chuck - A fun Chuck Norris joke all your way.\n";
  var c3 =
    "/chuck <firstname> - A Chuck Norris joke with the named person as the main character.\n";
  var c4 = "/quote - An inspirational quote all your way.\n";
  out = out + c0 + c1 + c2 + c3 + c4;
  bot.sendMessage(msg.chat.id, out);
});

bot.on("message", msg => {
  //getting message string
  var args = msg.text.split(" ");
  const chatId = msg.chat.id;

  //chuck norris script
  if (args[0] == "/chuck") {
    if (!args[1]) {
      var norris = "http://api.icndb.com/jokes/random";
    } else {
      var norris = "http://api.icndb.com/jokes/random?firstName=" + args[1];
    }
    // Make a request for a user with a given ID
    axios
      .get(norris)
      .then(function(response) {
        // handle success
        var joke = response["data"].value.joke;
        bot.sendMessage(chatId, joke);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  }
  //xkcd script
  if (args[0] == "/xkcd") {
    var max = 3000;
    var min = 0;
    var index = Math.floor(Math.random() * (+max - +min)) + +min;
    const url = "https://xkcd.com/" + index;
    console.log(url);

    rp(url)
      .then(function(html) {
        //success!
        var strip = $("#comic > img", html)[0].attribs.src;
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
  //quote script
  if (args[0] == "/quote") {
    if (!args[1]) {
      var quoteID = Math.floor(Math.random() * quotes.length);
      var quote = quotes[quoteID].text;
      var author = quotes[quoteID].from;
      var full_quote = quote + "\nBy - " + author;
      bot.sendMessage(chatId, full_quote);
    }
  }
});

bot.on("message", msg => {
  //welcome greeting
  if (msg.new_chat_members) {
    let out = "Welcome ";
    //mapping usernames to output string from the new users array
    const welcomemsg = msg.new_chat_members.map(usr => {
      out = out + " @" + usr.username;
    });
    bot.sendMessage(msg.chat.id, out);
  }
  if (msg.left_chat_member) {
    bot.sendMessage(msg.chat.id, "Bye @" + msg.left_chat_member.username);
  }
});

bot.onText(/\/meetups/, msg => {
  var count = 0;
  var final1 = "";
  for (let i = 0; i < urls.length; i++) {
    meetup.getEvents(
      {
        group_urlname: urls[i]
      },
      function(error, events) {
        if (error) {
          console.log("No meetups listed.");
        } else {
          if (events.results.length == 0) {
            count = count + 1;
            console.log("No upcoming events listed.count =", count);
            if (count == urls.length) {
              bot.sendMessage(msg.chat.id, final1);
              console.log("Done");
            }
          } else {
            count = count + 1;
            community = communities[i];
            title = events.results[0].name;
            meetup_url = events.results[0].event_url;
            var format1 = new Date(events.results[0].time);
            meetup_date = format1.toDateString();
            meetupslist =
              "Community - " +
              community +
              "\n" +
              "Title - " +
              title +
              "\n" +
              "Date - " +
              meetup_date +
              "\n" +
              "Meetup Link - " +
              meetup_url +
              "\n\n";
            final1 = final1.concat(meetupslist);
            console.log("count value = ", count);

            if (count == urls.length) {
              bot.sendMessage(msg.chat.id, final1);
              console.log("Done");
            }
          }
        }
      }
    );
  }
});
