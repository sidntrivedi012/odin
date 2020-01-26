const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const rp = require("request-promise");
const $ = require("cheerio");
const quotes = require("./static/quotes.json");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();

const meetupurls = [
  "ilugdelhi",
  "Gurgaon-Go-Meetup",
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
  let out =
    "Hey, I am odin. You can interact with me using the following commands:\n";
  let c0 = "/meetups - Find a list of upcoming meetups in NCR.\n";
  let c1 = "/xkcd - I will send an awesome xkcd script all your way.\n";
  let c2 = "/chuck - A fun Chuck Norris joke all your way.\n";
  let c3 =
    "/chuck <firstname> - A Chuck Norris joke with the named person as the main character.\n";
  let c4 = "/quote - An inspirational quote all your way.\n";
  out = out + c0 + c1 + c2 + c3 + c4;
  bot.sendMessage(msg.chat.id, out);
});

bot.on("message", msg => {
  //getting message string
  let args = msg.text.split(" ");
  const chatId = msg.chat.id;

  //chuck norris script
  if (args[0] == "/chuck") {
    if (!args[1]) {
      let norris = "http://api.icndb.com/jokes/random";
    } else {
      let norris = "http://api.icndb.com/jokes/random?firstName=" + args[1];
    }
    // Make a request for a user with a given ID
    axios
      .get(norris)
      .then(function(response) {
        // handle success
        let joke = response["data"].value.joke;
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
  //quote script
  if (args[0] == "/quote") {
    if (!args[1]) {
      let quoteID = Math.floor(Math.random() * quotes.length);
      let quote = quotes[quoteID].text;
      let author = quotes[quoteID].from;
      let full_quote = quote + "\nBy - " + author;
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

bot.onText(/\/meetups/, async msg => {
  let out = "List of upcoming meetups in Delhi-NCR : ";
  //array.map is synchronous function which returns an array of unresolved promises so needs promises.all to wait for all the promises to be resolved before we can make use of the resulting Array.
  const meetuplist = await Promise.all(
    meetupurls.map(async url => {
      const meetup = "https://api.meetup.com/" + url + "/events";
      let res = await axios.get(meetup);
      if (res["data"][0]) {
        out1 =
          "\n\nTitle: " +
          res["data"][0].name +
          "\nDate: " +
          res["data"][0].local_date +
          "\nCommunity: " +
          res["data"][0].group.name +
          "\nLink: " +
          res["data"][0].link;
        if (out1) {
          out = out + out1;
        }
      }
    })
  );
  bot.sendMessage(msg.chat.id, out);
});

//Feature to save links and articles
mongoose.connect("mongodb://localhost:27017/Odin_bot");
const NotesSchema = new Schema({
  ChatID: Number,
  name: String,
  content: String
});

const SavedNotes = mongoose.model("SavedNote", NotesSchema);

bot.on("message", async msg => {
  //getting message string
  let args = msg.text.split(" ");
  const chatId = msg.chat.id;

  //Save a note
  if (args[0] == "/save") {
    //Check if note with the same name already exists
    await SavedNotes.find(
      { ChatID: chatId, name: args[1] },
      async (err, notes) => {
        if (notes.length == 0) {
          await SavedNotes.create({
            ChatID: chatId,
            name: args[1],
            content: args.splice(2, args.length).join(" ")
          });
          bot.sendMessage(chatId, "Note Saved");
        } else {
          bot.sendMessage(chatId, "Note with the same name already exists");
        }
      }
    );
  }
  //View saved notes
  if (args[0] == "/saved") {
    await SavedNotes.find({ ChatID: chatId }, (err, notes) => {
      if (err) {
        console.log(err);
      }
      if (notes.length == 0) {
        bot.sendMessage(chatId, "No Saved Notes");
      } else {
        out = "Saved notes are : \n";
        notes.map(note => {
          out = out + "· /" + note.name + "\n";
        });
        bot.sendMessage(chatId, out);
      }
    });
  }
  //Delete saved notes
  if (args[0] == "/delete") {
    //Check if note exists
    await SavedNotes.find(
      { ChatID: chatId, name: args[1] },
      async (err, notes) => {
        if (notes.length == 0) {
          bot.sendMessage(chatId, "Note doesn't exist");
        } else {
          await SavedNotes.deleteOne({ ChatID: chatId, name: args[1] });
          bot.sendMessage(chatId, "Note deleted");
        }
      }
    );
  }
});

//View a specific note
bot.onText(/^\//, async msg => {
  //getting message string
  let args = msg.text.split(" ");
  const chatId = msg.chat.id;
  await SavedNotes.find(
    { ChatID: chatId, name: args[0].replace("/", "") },
    (err, notes) => {
      if (err) {
        console.log(err);
      }
      notes.map(note => {
        bot.sendMessage(chatId, note.content);
      });
    }
  );
});
