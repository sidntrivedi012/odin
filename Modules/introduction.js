const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Introduction check on new chat member
const NewUserSchema = new Schema({
  ChatID: Number,
  UserName: String,
  UserId: String,
  JoinDate: Number,
  introduction: Boolean
});

const NewUser = mongoose.model("newuser", NewUserSchema);
//Adding New Users to database
const introduction = async (bot, msg) => {
  if (msg.new_chat_members) {
    const intro = msg.new_chat_members.map(async usr => {
      let d = new Date();
      await NewUser.create({
        ChatID: msg.chat.id,
        UserName: usr.username,
        UserId: usr.id,
        JoinDate: d.getTime(),
        introduction: false
      });
    });
    bot.sendMessage(
      msg.chat.id,
      "Kindly introduce yourself. Start your message with #introduction, so that I can verify your introduction. \nIf you don't introduce yourself in 24 hours you will be kicked from the group."
    );
  }
  //Set Introduction to True
  if (msg.text.match(/^#introduction/)) {
    await NewUser.updateOne(
      { ChatID: msg.chat.id, UserId: msg.from.id },
      { introduction: true }
    );
    bot.sendMessage(
      msg.chat.id,
      "Hey " + msg.from.username + ", you are now verified. Thanks for joining."
    );
  }
};

module.exports = introduction;
module.exports.NewUser = NewUser;
