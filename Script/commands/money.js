module.exports.config = {
  name: "money",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Butterfly Sizu💟🦋 & Maruf System💫",
  description: "Check your current balance",
  commandCategory: "Economy",
  usages: "[tag/reply/@mention or leave empty]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, Currencies }) => {
  const { threadID, messageID, senderID, mentions, type, messageReply, args } = event;

  let uid;

  // If user is replying to someone
  if (type == "message_reply") {
    uid = messageReply.senderID;
  }
  // If user mentions someone
  else if (Object.keys(mentions).length > 0) {
    uid = Object.keys(mentions)[0];
  }
  // If user writes an UID
  else if (args[0] && !isNaN(args[0])) {
    uid = args[0];
  }
  // Default to self
  else {
    uid = senderID;
  }

  const money = (await Currencies.getData(uid)).money || 0;

  const name = (await api.getUserInfo(uid))[uid].name || "User";

  return api.sendMessage(
    `💰 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 𝗖𝗵𝗲𝗰𝗸 💰\n\n👤 Name: ${name}\n💸 Coins: ${money}$`,
    threadID,
    messageID
  );
};
