const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const { Notes } = require("./Modules/Notes");
const chuck = require("./Modules/chuck");
const greet = require("./Modules/greeting");
const introduction = require("./Modules/introduction");
const meetups = require("./Modules/meetups");
const quote = require("./Modules/quote");
const xkcd = require("./Modules/xkcd");
const cron = require("node-cron");
require("dotenv").config();

const token = process.env.TELEGRAM_API_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
//Establish connection to the database
mongoose.connect("mongodb://localhost:27017/Odin_bot");

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
bot.onText(/\/(heyodin|start)/, msg => {
  //heylisa script
  let out =
    "Hey, I am odin. You can interact with me using the following commands:\n";
  let c0 = "/meetups - Find a list of upcoming meetups in NCR.\n";
  let c1 = "/xkcd - I will send an awesome xkcd script all your way.\n";
  let c2 = "/chuck - A fun Chuck Norris joke all your way.\n";
  let c3 =
    "/chuck <firstname> - A Chuck Norris joke with the named person as the main character.\n";
  let c4 = "/quote - An inspirational quote all your way.\n";
  let c5 = "/save <note-name> <note-content> - Saves note to the database.\n";
  let c6 = "/saved - Sends the list of saved notes from the database.\n";
  let c7 = "/delete <note-name>` - Deletes note from the database.\n";
  out = out + c0 + c1 + c2 + c3 + c4 + c5 + c6 + c7;
  bot.sendMessage(msg.chat.id, out);
});

bot.on("message", msg => {
  greet(bot, msg);
  introduction(bot, msg);
  if (msg.text) {
    chuck(bot, msg);
    xkcd(bot, msg);
    quote(bot, msg);
    meetups(bot, msg);
    Notes(bot, msg);
  }
});

//Check if new user introduced himself or not
//Cron Job to carry the check every 2 hour
cron.schedule("0 */2 * * *", async () => {
  await introduction.NewUser.find({ introduction: false }, (err, users) => {
    if (err) {
      console.log(err);
    }
    users.map(usr => {
      console.log(usr);
      let d = new Date();
      const DAY = 86400000;
      if (d.getTime() - usr.JoinDate >= DAY) {
        console.log("Kicking user ", usr.UserName);
        bot.kickChatMember(usr.ChatID, usr.UserId);
      } else if (d.getTime() - usr.JoinDate >= DAY / 2) {
        bot.sendMessage(
          usr.ChatID,
          "WARNING for @" +
            usr.UserName +
            "\nKindly introduce yourself within the next 12 hours or you will be kicked"
        );
      }
    });
  });
});

bot.on("polling_error", err => console.log(err));
