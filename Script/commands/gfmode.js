module.exports.config = {
  name: "gfmode",
  version: "2.0.0",
  hasPermssion: 2, // Only admin can toggle
  credits: "Butterfly Sizu💟🦋 & Maruf System💫",
  description: "Activate/deactivate GF mode for specific users with romantic replies",
  commandCategory: "love",
  usages: "[on/off] (reply to user)",
  cooldowns: 5
};

if (!global.gfmode) global.gfmode = {};
const adminUID = ["100070782965051"]; // Maruf only

const romanticReplies = [
  "আমি তোমাকে ছাড়া কিছুই ভাবতে পারি না 💕",
  "তুমি আমার স্বপ্নে আসো রোজ রাতে 🌙",
  "ভালোবাসা মানেই তুমিই আমার কাছে 😘",
  "আমার মনটা শুধু তোমাকেই খোঁজে ❤️",
  "তুমি ছাড়া এই জীবনটা শুন্য 💫",
  "তোমার মেসেজ মানেই একটা ছোট্ট খুশির বৃষ্টি 🌧️🥰",
  "আমার হিয়াতে শুধু তুমিই বাজো 🎶"
];

const casualReplies = [
  "ওকে বলো 😊",
  "আচ্ছা শুনছি 🙃",
  "বেশ, বলো তোমার কথা 😄",
  "হুম, তারপর? 🤔",
  "কি বলো তুমি? 😅",
  "হ্যাঁ বলো, শুনছি 🎧",
  "জ্বী বলুন 😌"
];

// ✅ Command to toggle GF mode
module.exports.run = async function ({ api, event, args }) {
  const { senderID, messageReply, threadID } = event;

  if (!adminUID.includes(senderID))
    return api.sendMessage("❌ শুধু মারুফ ই এই কমান্ড চালাতে পারবে!", threadID);

  if (!args[0] || !["on", "off"].includes(args[0].toLowerCase()))
    return api.sendMessage("⚠️ সঠিক ফরম্যাট: .gfmode on/off (reply দিয়ে)", threadID);

  if (!messageReply)
    return api.sendMessage("⚠️ অনুগ্রহ করে যাকে GF Mode দিতে চাও তার মেসেজে reply করো!", threadID);

  const targetID = messageReply.senderID;
  const action = args[0].toLowerCase();

  if (action === "on") {
    global.gfmode[targetID] = true;
    return api.sendMessage(`✅ GF Mode চালু হয়েছে এই ইউজারের জন্য: ${targetID}`, threadID);
  } else {
    delete global.gfmode[targetID];
    return api.sendMessage(`💔 GF Mode বন্ধ করা হলো এই ইউজারের জন্য: ${targetID}`, threadID);
  }
};

// ✅ Auto romantic responder (built-in)
module.exports.handleEvent = async function ({ api, event }) {
  const { senderID, body, threadID } = event;

  if (!body || senderID == api.getCurrentUserID()) return;

  const text = body.toLowerCase();

  const isGF = global.gfmode?.[senderID];

  const romanticTriggers = [
    "i love you", "ভালোবাসি", "miss you", "ভালো লাগে", "আমার মন খারাপ", "তুমি কি করো", "ভালো থাকো", "তুমি কে", "ভালোবাসো?"
  ];

  if (romanticTriggers.some(trigger => text.includes(trigger))) {
    const reply = isGF
      ? romanticReplies[Math.floor(Math.random() * romanticReplies.length)]
      : casualReplies[Math.floor(Math.random() * casualReplies.length)];

    return api.sendMessage(reply, threadID);
  }
};

// ✅ Required to register event handler
module.exports.languages = {};
module.exports.event = module.exports.handleEvent;
