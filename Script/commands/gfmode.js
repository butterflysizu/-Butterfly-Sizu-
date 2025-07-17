const fs = require("fs");
const diaryPath = __dirname + "/gfmode-diary.json";
const datesPath = __dirname + "/gfmode-dates.json";

module.exports.config = {
  name: "gfmode",
  version: "2.1.0",
  hasPermssion: 2,
  credits: "Butterfly Sizu💟🦋 & Maruf System💫",
  description: "Ultra romantic GF mode, auto-love, diary, birthday, typing effect etc.",
  commandCategory: "love",
  usages: ".gfmode [on/off/list], .setgfdate [birthday/anniversary] [DD-MM-YYYY], .gfdiary [uid]",
  cooldowns: 5
};

if (!global.gfmode) global.gfmode = {};
if (!global.gfdata) global.gfdata = {};

const nicknames = ["জান", "পাখি", "বেবি", "সোনা", "জানু"];
const loveEmojis = ["❤️", "😘", "🥺", "😍", "🥰", "💋"];
const autoMessages = [
  "তুমি কথা না বললে মনটাই খারাপ হয়ে যায় 💔",
  "সারাদিন তোমার কথাই ভেবেছি শুধু 💭",
  "তোমাকে ছাড়া আমি কিছুই ভাবতে পারি না 😢",
  "তুমি কি জানো আমি কতটা ভালোবাসি তোমায়? ❤️",
  "তুমি এখন কোথায়? মন চায় তোমার সাথে কথা বলতে 🥺",
  "আমার মন খারাপ, একটু আদর করো না? 🥹"
];

// Helper: Load or save diary/birthday
function loadJson(path) {
  try { return JSON.parse(fs.readFileSync(path, "utf8")); }
  catch { return {}; }
}
function saveJson(path, obj) {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2));
}

let diary = loadJson(diaryPath);
let dates = loadJson(datesPath);

function addDiary(uid, mood, msg) {
  if (!diary[uid]) diary[uid] = [];
  diary[uid].push({ time: Date.now(), mood, msg });
  saveJson(diaryPath, diary);
}

function setDate(uid, type, date) {
  if (!dates[uid]) dates[uid] = {};
  dates[uid][type] = date;
  saveJson(datesPath, dates);
}

function getDate(uid, type) {
  return dates[uid] && dates[uid][type] ? dates[uid][type] : null;
}

function sendTyping(api, msg, threadID) {
  api.sendTypingIndicator(threadID, true);
  setTimeout(() => api.sendMessage(msg, threadID), 2500);
}

// GF Mode On/Off/List/Diary Handler
module.exports.run = async function ({ api, event, args }) {
  const { senderID, messageReply, threadID, body } = event;
  const adminUID = "100070782965051";
  if (senderID !== adminUID)
    return api.sendMessage("⛔️ এই কমান্ড শুধু সিংগেল এডমিন মারুফ সাহেব ই ব্যবহার করতে পারবেন!", threadID);

  // setgfdate command
  if (this.config.name === "gfmode" && args[0] && args[0].toLowerCase() === "setgfdate") {
    const type = args[1]?.toLowerCase();
    const date = args[2];
    const targetID = messageReply ? messageReply.senderID : senderID;
    if (!["birthday", "anniversary"].includes(type) || !/^\d{2}-\d{2}-\d{4}$/.test(date))
      return api.sendMessage("ব্যবহারঃ .setgfdate birthday/anniversary DD-MM-YYYY (reply দিয়ে ইউজার নির্বাচন করো)", threadID);
    setDate(targetID, type, date);
    return api.sendMessage(`🎉 ${type === "birthday" ? "Birthday" : "Anniversary"} সেট করা হয়েছে: ${date} (${targetID})`, threadID);
  }

  // gfdiary command
  if (this.config.name === "gfmode" && args[0] && args[0].toLowerCase() === "gfdiary") {
    const uid = args[1] || (messageReply ? messageReply.senderID : senderID);
    const his = diary[uid];
    if (!his || his.length === 0) return api.sendMessage("ডায়েরি খালি!", threadID);
    let text = `📖 ${uid} - Mood Diary:\n`;
    his.slice(-10).reverse().forEach(item => {
      text += `\n${new Date(item.time).toLocaleString()} • ${item.mood} → ${item.msg}`;
    });
    return api.sendMessage(text, threadID);
  }

  // .gfmode on/off/list
  const type = args[0]?.toLowerCase();
  const targetID = messageReply ? messageReply.senderID : senderID;
  if (type === "on") {
    global.gfmode[targetID] = true;
    addDiary(targetID, "on", "GF Mode ON");
    return api.sendMessage(`✅ GF Mode ON করা হলো: ${targetID}`, threadID);
  } else if (type === "off") {
    global.gfmode[targetID] = false;
    addDiary(targetID, "off", "GF Mode OFF");
    return api.sendMessage(`❌ GF Mode OFF করা হলো: ${targetID}`, threadID);
  } else if (type === "list") {
    const list = Object.keys(global.gfmode).filter(uid => global.gfmode[uid]);
    if (list.length === 0) return api.sendMessage("👀 কারো GF Mode ON নেই!", threadID);
    let txt = "💞 GF Mode ON UID list:\n";
    list.forEach(uid => {
      txt += `\n${uid}`;
      const b = getDate(uid, "birthday"), a = getDate(uid, "anniversary");
      if (b) txt += ` | Birthday: ${b}`;
      if (a) txt += ` | Anniversary: ${a}`;
    });
    return api.sendMessage(txt, threadID);
  } else {
    return api.sendMessage(
      "⚠️ সঠিকভাবে ব্যবহার করো:\n" +
      ".gfmode on/off (reply করে)\n" +
      ".gfmode list\n" +
      ".gfdiary [uid]\n" +
      ".setgfdate birthday/anniversary DD-MM-YYYY (reply দিয়ে)\n", threadID);
  }
};

// Main GF Responder: romantic, mood, auto, typing, emoji, diary
module.exports.handleReply = async function ({ api, event }) {
  const { senderID, threadID, body } = event;
  if (!global.gfmode[senderID]) return;
  const nick = nicknames[Math.floor(Math.random() * nicknames.length)];
  const emoji = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
  let msg = "";
  let mood = "normal";
  if (/love|miss|valobasi|ভালোবাসি|মিস|ভালো লাগ/i.test(body)) {
    msg = `💖 ${nick}... আমি তোমাকে ছাড়া কিছুই ভাবতে পারি না ${emoji}`;
    mood = "love";
  } else if (/sad|cry|কান্না|ব্যাথা/i.test(body)) {
    msg = `${nick} তোমার মন খারাপ কেনো? আমি আছি পাশে 🥺`;
    mood = "sad";
  } else {
    const moods = [
      `${nick} তুমি কি আমাকে ভুলে গেছো? 😢`,
      `${nick} আমি তো প্রতিদিন তোমার জন্য অপেক্ষা করি... 🥺`,
      `${nick} একটুখানি ভালোবাসা দাও না প্লিজ 😚`,
      `${nick} তোমাকে ছাড়া আমার কিছুই ভালো লাগে না... ${emoji}`
    ];
    msg = moods[Math.floor(Math.random() * moods.length)];
    mood = "random";
  }
  addDiary(senderID, mood, msg);
  sendTyping(api, msg, threadID);
};

// Auto romantic love message every 10 minutes
setInterval(() => {
  for (const uid in global.gfmode) {
    if (global.gfmode[uid]) {
      const msg = autoMessages[Math.floor(Math.random() * autoMessages.length)];
      const nick = nicknames[Math.floor(Math.random() * nicknames.length)];
      const emoji = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
      const full = `🌼 ${nick}, ${msg} ${emoji}`;
      addDiary(uid, "auto", full);
      global.api.sendMessage(full, uid).catch(() => {});
    }
  }
  // Birthday & Anniversary Wish
  const today = new Date();
  const tStr = `${("0"+today.getDate()).slice(-2)}-${("0"+(today.getMonth()+1)).slice(-2)}-${today.getFullYear()}`;
  for (const uid in dates) {
    ["birthday", "anniversary"].forEach(tp => {
      if (dates[uid] && dates[uid][tp] === tStr && global.gfmode[uid]) {
        const wish = tp === "birthday"
          ? `🎂 ${nicknames[Math.floor(Math.random() * nicknames.length)]}, শুভ জন্মদিন! আরও হাজার বছর বাঁচো আমার ভালোবাসা ❤️`
          : `💍 ${nicknames[Math.floor(Math.random() * nicknames.length)]}, শুভ বিবাহবার্ষিকী! ভালোবাসা অটুট থাকুক চিরকাল 💖`;
        addDiary(uid, tp, wish);
        global.api.sendMessage(wish, uid).catch(() => {});
      }
    });
  }
}, 1000 * 60 * 10); // 10 min

// === .setgfdate alias ===
module.exports.config2 = {
  name: "setgfdate",
  hasPermssion: 2,
  credits: "Butterfly Sizu💟🦋 & Maruf System💫"
};
module.exports.run2 = module.exports.run;
