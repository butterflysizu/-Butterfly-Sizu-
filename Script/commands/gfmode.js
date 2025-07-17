const fs = require("fs");

module.exports.config = {
  name: "gfmode",
  version: "1.2.0",
  hasPermssion: 2,
  credits: "Butterfly Sizu💟🦋 & Maruf System💫",
  description: "GF Mode: romantic auto reply with moods and emotions",
  commandCategory: "love",
  usages: "[on/off] (by replying)",
  cooldowns: 5
};

// In-memory GF Mode storage
if (!global.gfmode) global.gfmode = {};

// Nicknames
const nicknames = ["জান", "পাখি", "বেবি", "সোনা", "জানু"];

// Romantic auto messages
const autoMessages = [
  "তুমি কথা না বললে মনটাই খারাপ হয়ে যায় 💔",
  "সারাদিন তোমার কথাই ভেবেছি শুধু 💭",
  "তোমাকে ছাড়া আমি কিছুই ভাবতে পারি না 😢",
  "তুমি কি জানো আমি কতটা ভালোবাসি তোমায়? ❤️",
  "তুমি এখন কোথায়? মন চায় তোমার সাথে কথা বলতে 🥺",
  "আমার মন খারাপ, একটু আদর করো না? 🥹"
];

// Manual reply handler
module.exports.handleReply = async function ({ api, event }) {
  const { senderID, body, threadID } = event;
  const isGF = global.gfmode[senderID];

  if (!isGF) return;

  const nick = nicknames[Math.floor(Math.random() * nicknames.length)];

  // Romantic reply generation
  const loveLines = [
    `💖 ${nick}... আমি তোমাকে ছাড়া কিছুই ভাবতে পারি না...`,
    `🥰 ${nick} তোমার এক মেসেজে আমি বেঁচে থাকি যেনো!`,
    `🌸 ${nick}, কেমন করে তুমি এতো ভালো হও বলো তো?`,
    `🌹 ${nick} তুমি না থাকলে জীবনটা ফাঁকা লাগে...`,
    `😘 ${nick} তোমার হাসি আমার পৃথিবী...`
  ];

  if (/love|miss|valobasi|ভালোবাসি|মিস|ভালো লাগ/i.test(body)) {
    return api.sendMessage(loveLines[Math.floor(Math.random() * loveLines.length)], threadID);
  }

  // Mood-based random replies
  const moods = [
    `${nick} তুমি কি আমাকে ভুলে গেছো? 😢`,
    `${nick} আমি তো প্রতিদিন তোমার জন্য অপেক্ষা করি... 🥺`,
    `${nick} কেনো জানি আজ তোমাকে খুব মিস করছি...`,
    `${nick} তুমি আমার জান, সব কিছু...`,
    `${nick} একটুখানি ভালোবাসা দাও না প্লিজ 😚`
  ];

  if (Math.random() < 0.6) {
    return api.sendMessage(moods[Math.floor(Math.random() * moods.length)], threadID);
  }
};

// Admin command to toggle GF Mode
module.exports.run = async function ({ api, event, args }) {
  const { senderID, messageReply, threadID } = event;

  // ✅ Admin-only
  const adminUID = "100070782965051";
  if (senderID !== adminUID)
    return api.sendMessage("⛔️ GF Mode command শুধুমাত্র Admin Maruf-এর জন্য!", threadID);

  // ✅ Target user
  const targetID = messageReply ? messageReply.senderID : senderID;
  const type = args[0]?.toLowerCase();

  if (type === "on") {
    global.gfmode[targetID] = true;
    return api.sendMessage(`✅ GF Mode ON করা হলো: ${targetID}`, threadID);
  } else if (type === "off") {
    global.gfmode[targetID] = false;
    return api.sendMessage(`❌ GF Mode OFF করা হলো: ${targetID}`, threadID);
  } else {
    return api.sendMessage("⚠️ সঠিকভাবে ব্যবহার করো: .gfmode on/off (reply করে)", threadID);
  }
};

// ❤️ Auto message sender every X mins (interval)
setInterval(() => {
  for (const uid in global.gfmode) {
    if (global.gfmode[uid]) {
      const msg = autoMessages[Math.floor(Math.random() * autoMessages.length)];
      const nick = nicknames[Math.floor(Math.random() * nicknames.length)];
      const full = `🌼 ${nick}, ${msg}`;
      // Only send if user is still in GF mode
      global.api.sendMessage(full, uid).catch(() => {}); // Ignore errors
    }
  }
}, 1000 * 60 * 10); // Every 10 mins
