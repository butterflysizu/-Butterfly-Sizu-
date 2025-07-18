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

    const info = 
`╭───────── 🦋 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🦋 ─────────╮
│  👤 𝗡𝗮𝗺𝗲      : Maruf Billah
│  ☎️ 𝗣𝗵𝗼𝗻𝗲     : 01690247910
│  📬 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸   : fb.com/100070782965051
│  🏠 𝗔𝗱𝗱𝗿𝗲𝘀𝘀    : S. Malivita, Abdullahpur, Keraniganj
│  💖 𝗦𝘁𝗮𝘁𝘂𝘀    : Single
│  🕒 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝗧𝗶𝗺𝗲: ${time}
╰───────────────────────────────╯`;

    return api.sendMessage(info, event.threadID, event.messageID);
};
