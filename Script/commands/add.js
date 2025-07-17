const axios = require('axios');

/**
 * Bot Command: add
 * Owner: Maruf Billah
 * FB: facebook.com/100070782965051
 * Bot: 💫Butterfly🦋 Sizu💟
 */

module.exports.config = {
  name: "add",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Butterfly Sizu💟🦋 & Maruf System💫\nOwner: Maruf Billah\nFB: facebook.com/100070782965051",
  description: "Send a random sad video",
  commandCategory: "media",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  try {
    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments[0].type !== "video") {
      return api.sendMessage("⚠️ ভিডিও ফাইল reply দিয়ে কমান্ড দাও!", event.threadID, event.messageID);
    }
    const imageUrl = event.messageReply.attachments[0].url;
    const videoName = args.join(" ").trim();

    if (!videoName) {
      return api.sendMessage("Please provide a name for the video.", event.threadID, event.messageID);
    }

    const apis1 = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json');
    const Shaon1 = apis1.data.imgur;

    const imgurResponse = await axios.get(`${Shaon1}/imgur?link=${encodeURIComponent(imageUrl)}`);
    const imgurLink = imgurResponse.data.uploaded.image;

    const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json');
    const Shaon = apis.data.api;

    const response = await axios.get(`${Shaon}/video/random?name=${encodeURIComponent(videoName)}&url=${encodeURIComponent(imgurLink)}`);

    api.sendMessage(
      `💌MESSAGE: URL ADDED SUCCESSFULLY\n🟡NAME: ${response.data.name}\n🖇️URL: ${response.data.url}\n\n🔖Added by: Maruf Billah (💫Butterfly🦋 Sizu💟)\nFB: facebook.com/100070782965051`,
      event.threadID,
      event.messageID
    );

  } catch (e) {
    console.log(e);
    api.sendMessage(`An error occurred: ${e.message}`, event.threadID, event.messageID);
  }
};
