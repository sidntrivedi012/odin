const axios = require("axios");
const chuck = (bot, msg) => {
  //getting message string
  let args = msg.text.split(" ");
  const chatId = msg.chat.id;
  //chuck norris script
  if (args[0] == "/chuck") {
    let norris = "";
    if (!args[1]) {
      norris = "http://api.icndb.com/jokes/random";
    } else {
      norris = "http://api.icndb.com/jokes/random?firstName=" + args[1];
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
};
module.exports = chuck;
