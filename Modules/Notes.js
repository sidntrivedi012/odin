const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Feature to save links and articles
const NotesSchema = new Schema({
  ChatID: Number,
  name: String,
  content: String
});

const SavedNotes = mongoose.model("SavedNote", NotesSchema);

exports.Notes = async (bot, msg) => {
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
  //View a specific note
  if (args[0].match(/^\//)) {
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
  }
};
