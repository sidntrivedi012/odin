const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Feature to save links and articles
const EventSchema = new Schema({
  ChatID: Number,
  Name: String,
  Date: Date,
  Venue: String
});

const Event = mongoose.model("Event", EventSchema);

const Events = async (bot, msg) => {
  //getting message string
  let args = msg.text.split(" ");
  const chatId = msg.chat.id;

  //Add an event
  if (args[0] == "/addevent") {
    //Check if note with the same name already exists
    await Event.find({ ChatID: chatId, Name: args[1] }, async (err, events) => {
      if (events.length == 0) {
        await Event.create({
          ChatID: chatId,
          Name: args[1],
          Date: args[2],
          Venue: args[3]
        });
        bot.sendMessage(chatId, "Event Added");
      } else {
        bot.sendMessage(chatId, "Event with the same name already exists");
      }
    });
  }
  //View added events
  if (args[0] == "/events") {
    await Event.find({ ChatID: chatId }, (err, events) => {
      if (err) {
        console.log(err);
      }
      if (events.length == 0) {
        bot.sendMessage(chatId, "No Upcoming events");
      } else {
        out = "Upcoming Events are : \n";
        events.map(event => {
          out =
            out +
            "· " +
            "Name :" +
            event.Name +
            "\n" +
            "  Date :" +
            event.Date.toDateString() +
            "\n" +
            "  Venue :" +
            event.Venue +
            "\n\n";
        });
        bot.sendMessage(chatId, out);
      }
    });
  }
};

module.exports = Events;
module.exports.db = Event;
