const fs = require("fs");
const path = require("path");

// --------- GF MODE GLOBAL MEMORY + DATA PATHS ---------
if (!global.gfmode) global.gfmode = {};
const GF_DATA_PATH = path.join(__dirname, "gfdata.json");
const DIARY_PATH = path.join(__dirname, "gfdiary.json");

// --------- HELPER: Load/Save JSON ---------
function loadJSON(file, def = {}) {
  try { return JSON.parse(fs.readFileSync(file, "utf-8")); }
  catch { return def; }
}
function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// --------- GF MODE NICKNAMES ---------
const nicknames = ["জান", "পাখি", "বেবি", "সোনা", "জানু"];

// --------- DEFAULT AUTO-MESSAGES ---------
const autoMessages = [
  "তুমি কথা না বললে মনটাই খারাপ হয়ে যায় 💔",
  "সারাদিন তোমার কথাই ভেবেছি শুধু 💭",
  "তোমাকে ছাড়া আমি কিছুই ভাবতে পারি না 😢",
  "তুমি কি জানো আমি কতটা ভালোবাসি তোমায়? ❤️",
  "তুমি এখন কোথায়? মন চায় তোমার সাথে কথা বলতে 🥺",
  "আমার মন খারাপ, একটু আদর করো না? 🥹"
];

// --------- VOICE STYLE & EMOJI ONLY ---------
const voiceStyle = [
  "Hmm... জান 🥹", "Ufff জানু... তুমি না হলে চলেই না 😘", "Shonaaaa...🥺", "মুডটা ভালো নেই জান...", "আদর করো প্লিজ 🥰"
];
const emojiOnly = ["❤️", "🥰", "😚", "🤭", "🌹", "😍", "😜"];

// --------- MOOD REPLY TEMPLATES ---------
const moodReplies = [
  (nick) => `💖 ${nick}... আমি তোমাকে ছাড়া কিছুই ভাবতে পারি না...`,
  (nick) => `🥰 ${nick} তোমার এক মেসেজে আমি বেঁচে থাকি যেনো!`,
  (nick) => `🌸 ${nick}, কেমন করে তুমি এতো ভালো হও বলো তো?`,
  (nick) => `🌹 ${nick} তুমি না থাকলে জীবনটা ফাঁকা লাগে...`,
  (nick) => `😘 ${nick} তোমার হাসি আমার পৃথিবী...`,
  (nick) => `${nick} তুমি কি আমাকে ভুলে গেছো? 😢`,
  (nick) => `${nick} আমি তো প্রতিদিন তোমার জন্য অপেক্ষা করি... 🥺`,
  (nick) => `${nick} কেনো জানি আজ তোমাকে খুব মিস করছি...`,
  (nick) => `${nick} তুমি আমার জান, সব কিছু...`,
  (nick) => `${nick} একটুখানি ভালোবাসা দাও না প্লিজ 😚`
];

// --------- BIRTHDAY & ANNIVERSARY WISHES ---------
const birthdayWishes = [
  (nick) => `🎂 ${nick}! শুভ জন্মদিন জানু 💖 আরও অনেক বছর আমার সাথে থেকো!`,
  (nick) => `🥳 ${nick}, তোমার জন্মদিনে অনেক অনেক শুভেচ্ছা! চলো আজ সারাদিন ভালোবাসা দিবো!`
];
const annivWishes = [
  (nick) => `💍 ${nick}! শুভ বার্ষিকী! তোমার সাথে প্রতিটা মুহূর্ত অসাধারণ!`,
  (nick) => `🌹 ${nick}, আজ আমাদের ভালবাসার বার্ষিকী! অনেক ভালোবাসা নিও 😘`
];

// --------- MAIN CONFIG ---------
module.exports.config = {
  name: "gfmode",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "Butterfly Sizu💟🦋 & Maruf System💫",
  description: "Advanced GF Mode: romantic auto-reply, moods, diary, birthday, anniversary",
  commandCategory: "love",
  usages: "[on/off/list] (reply to user), .setgfdate (reply), .gfdiary [uid]",
  cooldowns: 5
};

// --------- ADMIN UID ONLY ---------
const adminUID = "100070782965051";

// --------- HANDLE REPLY (Mood & Diary) ---------
module.exports.handleReply = async function ({ api, event }) {
  const { senderID, body, threadID } = event;
  if (!global.gfmode[senderID]) return;

  const nick = nicknames[Math.floor(Math.random() * nicknames.length)];
  let msg;

  // Voice-style or emoji (10% chance each)
  if (Math.random() < 0.1) msg = voiceStyle[Math.floor(Math.random() * voiceStyle.length)];
  else if (Math.random() < 0.1) msg = emojiOnly[Math.floor(Math.random() * emojiOnly.length)];
  else msg = moodReplies[Math.floor(Math.random() * moodReplies.length)](nick);

  // Special keyword triggers (love/miss/valobasi)
  if (/love|miss|valobasi|ভালোবাসি|মিস|ভালো লাগ/i.test(body)) {
    msg = `💖 ${nick} আমি তোমাকে ছাড়া কিছুই ভাবতে পারি না...`;
  }

  // Log mood/diary
  let diary = loadJSON(DIARY_PATH, {});
  if (!diary[senderID]) diary[senderID] = [];
  diary[senderID].push({
    time: new Date().toLocaleString("bn-BD"),
    msg: body
  });
  saveJSON(DIARY_PATH, diary);

  return api.sendMessage(msg, threadID);
};

// --------- MAIN RUN: Commands ---------
module.exports.run = async function ({ api, event, args }) {
  const { senderID, threadID, messageReply, body } = event;

  if (senderID !== adminUID)
    return api.sendMessage("⛔️ এই কমান্ড টি শুধু সিংগেল এডমিন মারুফ সাহেব ই ব্যবহার করতে পারবেন!", threadID);

  // --- .gfmode list
  if (args[0] === "list") {
    const onUsers = Object.keys(global.gfmode).filter(uid => global.gfmode[uid]);
    if (onUsers.length === 0) return api.sendMessage("এখন কারও GF Mode ON নেই।", threadID);
    let str = "🔥 এখনকার Active GF Mode List:\n";
    for (const uid of onUsers) {
      str += `• UID: ${uid}\n`;
    }
    return api.sendMessage(str, threadID);
  }

  // --- .setgfdate (reply to user)
  if (this.config.name === "gfmode" && args[0] === "setgfdate") {
    if (!messageReply) return api.sendMessage("Reply দিয়ে টার্গেট ইউজার সিলেক্ট করুন!", threadID);
    api.sendMessage("ব্যবহার: .setgfdate birthday MM-DD বা anniversary MM-DD", threadID);
    return;
  }

  // --- .gfdiary [uid]
  if (this.config.name === "gfmode" && args[0] === "gfdiary") {
    let diary = loadJSON(DIARY_PATH, {});
    const uid = args[1] || (messageReply && messageReply.senderID);
    if (!uid || !diary[uid]) return api.sendMessage("ডায়েরি খুঁজে পাওয়া যায়নি।", threadID);
    let logs = diary[uid].map(e => `${e.time}: ${e.msg}`).slice(-10).join('\n');
    return api.sendMessage(`📒 [${uid}] শেষ ১০টা মুড/মেসেজ:\n${logs}`, threadID);
  }

  // --- .gfmode on/off (reply or self)
  if (["on", "off"].includes(args[0])) {
    const targetID = messageReply ? messageReply.senderID : senderID;
    if (args[0] === "on") {
      global.gfmode[targetID] = true;
      return api.sendMessage(`✅ GF Mode ON করা হলো: ${targetID}`, threadID);
    }
    if (args[0] === "off") {
      global.gfmode[targetID] = false;
      return api.sendMessage(`❌ GF Mode OFF করা হলো: ${targetID}`, threadID);
    }
  }

  // --- .setgfdate birthday/anniversary MM-DD (reply)
  if (args[0] === "setgfdate") {
    if (!messageReply) return api.sendMessage("Reply দিয়ে টার্গেট ইউজার সিলেক্ট করুন!", threadID);
    const type = args[1]; // birthday/anniversary
    const date = args[2]; // MM-DD
    if (!["birthday", "anniversary"].includes(type) || !/^\d{2}-\d{2}$/.test(date))
      return api.sendMessage("ব্যবহার: .setgfdate birthday MM-DD বা anniversary MM-DD", threadID);
    let data = loadJSON(GF_DATA_PATH, {});
    if (!data[messageReply.senderID]) data[messageReply.senderID] = {};
    data[messageReply.senderID][type] = date;
    saveJSON(GF_DATA_PATH, data);
    return api.sendMessage(`✅ ${type === "birthday" ? "Birthday" : "Anniversary"} সেট করা হয়েছে!`, threadID);
  }

  // --- fallback
  return api.sendMessage("ব্যবহার: .gfmode on/off (reply দিয়ে), .gfmode list, .setgfdate [birthday/anniv] MM-DD (reply দিয়ে), .gfdiary [uid]", threadID);
};

// --------- AUTO MESSAGE EVERY 10 MINUTES + BIRTHDAY/ANNIV CHECK ---------
setInterval(() => {
  // Load user dates
  const gfdata = loadJSON(GF_DATA_PATH, {});
  const today = new Date();
  const md = (today.getMonth() + 1).toString().padStart(2, "0") + "-" + today.getDate().toString().padStart(2, "0");

  for (const uid in global.gfmode) {
    if (!global.gfmode[uid]) continue;

    // Auto romantic message
    const nick = nicknames[Math.floor(Math.random() * nicknames.length)];
    const msg = autoMessages[Math.floor(Math.random() * autoMessages.length)];
    global.api.sendMessage(`🌼 ${nick}, ${msg}`, uid, () => {}, undefined);

    // Birthday / Anniversary wish
    const dates = gfdata[uid] || {};
    if (dates.birthday === md) {
      const wish = birthdayWishes[Math.floor(Math.random() * birthdayWishes.length)](nick);
      global.api.sendMessage(wish, uid, () => {}, undefined);
    }
    if (dates.anniversary === md) {
      const wish = annivWishes[Math.floor(Math.random() * annivWishes.length)](nick);
      global.api.sendMessage(wish, uid, () => {}, undefined);
    }
  }
}, 1000 * 60 * 10); // every 10 min
