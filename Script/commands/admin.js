const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "admin",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "MARUF", //don't change my credit 
    description: "Show Owner Info",
    commandCategory: "info",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    var time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

    var callback = () => api.sendMessage({
        body: `
╭───────── 🦋 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🦋 ─────────╮
│  👤 𝗡𝗮𝗺𝗲      : Maruf Billah
│  ☎️ 𝗣𝗵𝗼𝗻𝗲     : 01690247910
│  📬 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸   : fb.com/100070782965051
│  🏠 𝗔𝗱𝗱𝗿𝗲𝘀𝘀    : S. Malivita, Abdullahpur, Keraniganj
│  💖 𝗦𝘁𝗮𝘁𝘂𝘀    : Single
│  🕒 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝗧𝗶𝗺𝗲: ${time}
╰───────────────────────────────╯
        `,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
  
    return request(encodeURI(`https://graph.facebook.com/100000478146113/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
};
