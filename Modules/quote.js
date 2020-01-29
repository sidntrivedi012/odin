const quotes = require("../static/quotes.json");
const quote = (bot, msg) => {
  if (msg.text.match(/\/quote/)) {
    let quoteID = Math.floor(Math.random() * quotes.length);
    let quote = quotes[quoteID].text;
    let author = quotes[quoteID].from;
    let full_quote = quote + "\nBy - " + author;
    bot.sendMessage(msg.chat.id, full_quote);
  }
};
module.exports = quote;
