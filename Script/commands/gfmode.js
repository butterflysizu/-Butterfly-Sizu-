const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "gfmode",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "Butterfly Sizu💟🦋 & Maruf System💫",
  description: "GF Mode: romantic AI mode with mood, memory & date system",
  commandCategory: "love",
  usages: "[on/off/list/setgfdate/gfdiary]",
  cooldowns: 5
};

const DATA_FILE = path.join(__dirname, "gfdata.json");
if (!global.gfmode) global.gfmode = {};
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "{}");

// Load GF data
const loadData = () => JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
const saveData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// Admin UID
const adminUID = "100070782965051";

// Nicknames
const nicknames = ["জান", "পাখি", "বেবি", "সোনা", "জানু"];

// Auto romantic messages
const autoMessages = [
  "তুমি কথা না বললে মনটাই খারাপ হয়ে যায় 💔",
  "সারাদিন তোমার কথাই ভেবেছি শুধু 💭",
  "তোমাকে ছাড়া আমি কিছুই ভাবতে পারি না 😢",
  "তুমি কি জানো আমি কতটা ভালোবাসি তোমায়? ❤️",
  "তুমি এখন কোথায়? মন চায় তোমার সাথে কথা বলতে 🥺",
  "আমার মন খারাপ, একটু আদর করো না? 🥹"
];

// Handle romantic reply
module.exports.handleReply = async function ({ api, event }) {
  const { senderID, body, threadID } = event;
  const isGF = global.gfmode[senderID];
  if (!isGF) return;

  const data = loadData();
  const nick = nicknames[Math.floor(Math.random() * nicknames.length)];
  const loveLines = [
    `💖 ${nick}... আমি তোমাকে ছাড়া কিছুই ভাবতে পারি না...`,
    `🥰 ${nick} তোমার এক মেসেজে আমি বেঁচে থাকি যেনো!`,
    `🌸 ${nick}, কেমন করে তুমি এতো ভালো হও বলো তো?`,
    `🌹 ${nick} তুমি না থাকলে জীবনটা ফাঁকা লাগে...`,
    `😘 ${nick} তোমার হাসি আমার পৃথিবী...`
  ];

  // Save to diary
  if (!data[senderID]) data[senderID] = {};
  if (!data[senderID].diary) data[senderID].diary = [];
  data[senderID].diary.push({ msg: body, time: new Date().toLocaleString() });
  saveData(data);

  if (/love|miss|valobasi|ভালোবাসি|মিস|ভালো লাগ/i.test(body)) {
    return api.sendMessage(loveLines[Math.floor(Math.random() * loveLines.length)], threadID);
  }

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

// Main Command
module.exports.run = async function ({ api, event, args }) {
  const { senderID, messageReply, threadID } = event;
  const data = loadData();
  const targetID = messageReply ? messageReply.senderID : senderID;
  const command = args[0]?.toLowerCase();

  // Admin Only
  if (senderID !== adminUID)
    return api.sendMessage("⛔️ এই কমান্ড টি শুধুমাত্র সিংগেল এডমিন মারুফ সাহেব ই ব্যবহার করতে পারবেন!", threadID);

  switch (command) {
    case "on":
      global.gfmode[targetID] = true;
      return api.sendMessage(`✅ GF Mode চালু হলো UID: ${targetID}`, threadID);

    case "off":
      global.gfmode[targetID] = false;
      return api.sendMessage(`❌ GF Mode বন্ধ হলো UID: ${targetID}`, threadID);

    case "list":
      const list = Object.keys(global.gfmode).filter(uid => global.gfmode[uid]);
      return api.sendMessage(
        list.length ? `📋 GF Mode ON List:\n${list.join("\n")}` : "❌ কাউকে এখনো GF Mode-এ রাখা হয়নি।",
        threadID
      );

    case "gfdiary":
      if (!data[targetID]?.diary || data[targetID].diary.length === 0)
        return api.sendMessage("📓 এই UID এর কোনো মুড ডায়েরি পাওয়া যায়নি।", threadID);
      const entries = data[targetID].diary.slice(-5).map(d => `📝 ${d.msg} \n⏰ ${d.time}`).join("\n\n");
      return api.sendMessage(`📘 শেষ ৫টি মুড ডায়েরি:\n\n${entries}`, threadID);

    case "setgfdate":
      const field = args[1];
      const value = args[2];
      if (!["birthday", "anniversary"].includes(field) || !value)
        return api.sendMessage("⚠️ ব্যবহার: .setgfdate birthday/anniversary DD-MM", threadID);
      if (!data[targetID]) data[targetID] = {};
      data[targetID][field] = value;
      saveData(data);
      return api.sendMessage(`✅ ${field} সেট করা হয়েছে: ${value}`, threadID);

    default:
      return api.sendMessage("⚠️ .gfmode on/off/list/gfdiary/setgfdate", threadID);
  }
};

// Auto Message System
setInterval(() => {
  const data = loadData();
  for (const uid in global.gfmode) {
    if (!global.gfmode[uid]) continue;
    const nick = nicknames[Math.floor(Math.random() * nicknames.length)];
    const msg = autoMessages[Math.floor(Math.random() * autoMessages.length)];
    const full = `🌼 ${nick}, ${msg}`;
    global.api.sendMessage(full, uid).catch(() => {});
  }
}, 1000 * 60 * 10); // Every 10 mins
