const axios = require("axios");
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
const meetups = async (bot, msg) => {
  if (msg.text.match(/\/meetups/)) {
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
  }
};

module.exports = meetups;
