const fs = require("fs");

module.exports.config = {
  name: "gfmode",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "Butterfly Sizu💟🦋 & Maruf System💫",
  description: "GF Mode: romantic, human-like love mode",
  commandCategory: "love",
  usages: "[on/off/list] (reply user)",
  cooldowns: 5
};

// Only admin UID
const adminUID = "100070782965051";

// GF Mode memory
if (!global.gfmode) global.gfmode = {};

// Nicknames
const nicknames = ["জান", "পাখি", "বেবি", "সোনা", "জানু"];

// Auto messages
const autoMessages = [
  "তুমি কথা না বললে মনটাই খারাপ হয়ে যায় 💔",
  "আজ সারাদিন তোমার কথাই ভেবেছি... 😔",
  "তোমার কথা মনে পড়ছে খুব বেশি 😢",
  "তুমি ছাড়া আমি কিছুই ভাবতে পারি না ❤️",
  "তুমি এখন কোথায়? একটু কথা বলো না 🥺",
  "রাগ করেছো? আমাকে একটুখানি ক্ষমা করে দাও প্লিজ 🙏",
  "বৃষ্টি পড়ছে, যদি কাছে থাকতে পারতাম... ☔️",
  "আজ মনটা আনমনা, কষ্টে আছি তোমায় ছাড়া..."
];

// Romantic replies
const romanticReplies = [
  msg => `💖 ${msg.nick}... আমি তোমাকে ছাড়া কিছুই ভাবতে পারি না...`,
  msg => `🥰 ${msg.nick} তোমার একটুখানি মেসেজে আমার মন ভালো হয়ে যায়!`,
  msg => `🌸 ${msg.nick}, তুমি আমার পৃথিবী...`,
  msg => `🌹 ${msg.nick} তুমি না থাকলে জীবনটা যেন থেমে যায়...`,
  msg => `😘 ${msg.nick} তোমার হাসিটাই আমার সুখ 💕`
];

// Mood replies
const moodReplies = [
  msg => `${msg.nick}, আজ একটু মন খারাপ... তুমি আছো তো? 😢`,
  msg => `${msg.nick}, ইচ্ছা করছে তোমার কাধে মাথা রেখে ঘুমিয়ে যাই... 🥺`,
  msg => `${msg.nick}, কি করো এখন? আমাকে একটু মিস করো? 😔`,
  msg => `${msg.nick}, মন চায় তোমার সাথে গল্প করি সারারাত 🌙`,
  msg => `${msg.nick}, একটু ভালোবাসা দাও না প্লিজ... 😚`
];

// GF Mode auto responder
module.exports.handleReply = async ({ api, event }) => {
  const { senderID, body, threadID } = event;
  if (!global.gfmode[senderID]) return;

  const nick = nicknames[Math.floor(Math.random() * nicknames.length)];
  const message = { nick };

  if (/love|miss|ভালোবাসি|ভালবাসি|ভালো লাগ|মন খারাপ/i.test(body)) {
    const reply = romanticReplies[Math.floor(Math.random() * romanticReplies.length)](message);
    return sendTyping(api, threadID, reply);
  }

  if (Math.random() < 0.5) {
    const reply = moodReplies[Math.floor(Math.random() * moodReplies.length)](message);
    return sendTyping(api, threadID, reply);
  }
};

// Command executor
module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID, messageReply, body } = event;
  const command = args[0]?.toLowerCase();

  if (senderID !== adminUID) {
    return api.sendMessage("⛔ এই কমান্ড টি শুধু সিংগেল এডমিন মারুফ সাহেব ই ব্যবহার করতে পারবেন!", threadID);
  }

  if (command === "on" || command === "off") {
    const targetID = messageReply?.senderID || senderID;
    global.gfmode[targetID] = command === "on";
    return api.sendMessage(
      `✅ GF Mode ${command.toUpperCase()} করা হলো: ${targetID}`,
      threadID
    );
  }

  if (command === "list") {
    const list = Object.keys(global.gfmode).filter(uid => global.gfmode[uid]);
    if (list.length === 0) return api.sendMessage("💤 এখনো কারো GF Mode অন করা হয়নি।", threadID);
    return api.sendMessage(`💘 GF Mode অন করা আছে:\n\n${list.join("\n")}`, threadID);
  }

  return api.sendMessage("⚠️ সঠিকভাবে ব্যবহার করো: .gfmode [on/off/list] (reply দিয়ে)", threadID);
};

// Typing delay simulation
function sendTyping(api, threadID, message) {
  return new Promise(resolve => {
    api.sendTypingIndicator(threadID, true);
    setTimeout(() => {
      api.sendMessage(message, threadID);
      resolve();
    }, 2000 + Math.floor(Math.random() * 2000));
  });
}

// Auto love message every 10 minutes
setInterval(() => {
  for (const uid in global.gfmode) {
    if (global.gfmode[uid]) {
      const msg = autoMessages[Math.floor(Math.random() * autoMessages.length)];
      const nick = nicknames[Math.floor(Math.random() * nicknames.length)];
      const full = `🌼 ${nick}, ${msg}`;
      global.api.sendMessage(full, uid).catch(() => {});
    }
  }
}, 1000 * 60 * 10);
