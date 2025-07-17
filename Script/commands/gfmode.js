const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "gfmode",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "Butterfly Sizu💟🦋 & Maruf System💫",
  description: "Ultimate GF Mode with moods, memory, auto msg, diary, birthday",
  commandCategory: "love",
  usages: "[on/off/list] (by reply)",
  cooldowns: 5
};

// ✅ Memory Paths
const memoryPath = path.join(__dirname, "gf_memory.json");
const diaryPath = path.join(__dirname, "gf_diary.json");
const bdayPath = path.join(__dirname, "gf_birthdays.json");
if (!fs.existsSync(memoryPath)) fs.writeFileSync(memoryPath, JSON.stringify({}));
if (!fs.existsSync(diaryPath)) fs.writeFileSync(diaryPath, JSON.stringify({}));
if (!fs.existsSync(bdayPath)) fs.writeFileSync(bdayPath, JSON.stringify({}));

// ✅ In-memory storage
let gfUsers = JSON.parse(fs.readFileSync(memoryPath));
let moodDiary = JSON.parse(fs.readFileSync(diaryPath));
let bdays = JSON.parse(fs.readFileSync(bdayPath));

const nicknames = ["জান", "পাখি", "বেবি", "সোনা", "জানু"];
const autoMessages = [
  "তুমি কথা না বললে মনটাই খারাপ হয়ে যায় 💔",
  "সারাদিন তোমার কথাই ভেবেছি শুধু 💭",
  "তোমাকে ছাড়া আমি কিছুই ভাবতে পারি না 😢",
  "তুমি কি জানো আমি কতটা ভালোবাসি তোমায়? ❤️",
  "তুমি এখন কোথায়? মন চায় তোমার সাথে কথা বলতে 🥺",
  "আমার মন খারাপ, একটু আদর করো না? 🥹"
];
const loveLines = [
  "আমি তোমাকে ছাড়া কিছুই ভাবতে পারি না...",
  "তোমার এক মেসেজে আমি বেঁচে থাকি যেনো!",
  "কেমন করে তুমি এতো ভালো হও বলো তো?",
  "তুমি না থাকলে জীবনটা ফাঁকা লাগে...",
  "তোমার হাসি আমার পৃথিবী..."
];

// ✅ Romantic responder
module.exports.handleReply = async ({ api, event }) => {
  const { senderID, body, threadID } = event;
  if (!gfUsers[senderID]) return;

  const nick = nicknames[Math.floor(Math.random() * nicknames.length)];
  let reply;

  if (/love|miss|ভালোবাসি|মিস|মনে পড়ে|valobasi/i.test(body)) {
    reply = `💖 ${nick}, ${loveLines[Math.floor(Math.random() * loveLines.length)]}`;
  } else {
    const moods = [
      `${nick}, তুমি কি আমাকে ভুলে গেছো? 😢`,
      `${nick}, আমি প্রতিদিন তোমার জন্য অপেক্ষা করি 🥺`,
      `${nick}, আজ কেনো জানি তোমাকে খুব মিস করছি...`,
      `${nick}, তুমি আমার সব কিছু...`,
      `${nick}, একটু ভালোবাসা চাই 🫶`
    ];
    reply = moods[Math.floor(Math.random() * moods.length)];
  }

  api.sendMessage(reply, threadID);

  // 📝 Log diary
  moodDiary[senderID] = moodDiary[senderID] || [];
  moodDiary[senderID].push({ time: Date.now(), msg: body });
  fs.writeFileSync(diaryPath, JSON.stringify(moodDiary, null, 2));
};

// ✅ Admin command to toggle or view list
module.exports.run = async function ({ api, event, args }) {
  const { senderID, messageReply, threadID } = event;
  const adminUID = "100070782965051";

  if (senderID !== adminUID)
    return api.sendMessage("❌ এই কমান্ড টি শুধু সিংগেল এডমিন মারুফ সাহেব ই ব্যবহার করতে পারবেন", threadID);

  const type = args[0]?.toLowerCase();

  if (type === "list") {
    const list = Object.keys(gfUsers).filter(uid => gfUsers[uid]);
    if (list.length === 0) return api.sendMessage("📛 এখন কেউ GF Mode এ নেই", threadID);
    return api.sendMessage(`💘 GF Mode অন থাকা UID:
${list.join("\n")}`, threadID);
  }

  const targetID = messageReply ? messageReply.senderID : senderID;
  if (type === "on") {
    gfUsers[targetID] = true;
    fs.writeFileSync(memoryPath, JSON.stringify(gfUsers, null, 2));
    return api.sendMessage(`✅ GF Mode ON করা হলো: ${targetID}`, threadID);
  } else if (type === "off") {
    gfUsers[targetID] = false;
    fs.writeFileSync(memoryPath, JSON.stringify(gfUsers, null, 2));
    return api.sendMessage(`❌ GF Mode OFF করা হলো: ${targetID}`, threadID);
  } else {
    return api.sendMessage("⚠️ ব্যবহার: .gfmode on/off/list (reply করে)", threadID);
  }
};

// 💌 Auto message every 10 mins
setInterval(() => {
  for (const uid in gfUsers) {
    if (gfUsers[uid]) {
      const msg = autoMessages[Math.floor(Math.random() * autoMessages.length)];
      const nick = nicknames[Math.floor(Math.random() * nicknames.length)];
      const full = `🌼 ${nick}, ${msg}`;
      global.api.sendMessage(full, uid).catch(() => {});
    }
  }
}, 1000 * 60 * 10); // Every 10 mins

// 🎂 Birthday / Anniversary reminders (run daily if possible)
function checkSpecialDates() {
  const today = new Date().toISOString().slice(5, 10); // MM-DD
  for (const uid in bdays) {
    const { birthday, anniversary } = bdays[uid];
    if (birthday === today) {
      global.api.sendMessage(`🎉 ${uid}, শুভ জন্মদিন! আজ তোমার special day 🥳`, uid).catch(() => {});
    }
    if (anniversary === today) {
      global.api.sendMessage(`💍 ${uid}, শুভ প্রেম দিবস বা বার্ষিকী! ভালোবাসা চিরকাল থাকুক 💖`, uid).catch(() => {});
    }
  }
}
setInterval(checkSpecialDates, 1000 * 60 * 60 * 6); // Every 6 hours
