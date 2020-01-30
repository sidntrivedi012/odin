const greet = (bot, msg) => {
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
};

module.exports = greet;
