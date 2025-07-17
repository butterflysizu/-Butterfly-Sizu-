module.exports.config = {
  name: "gfmode",
  version: "1.1.0",
  hasPermssion: 2,
  credits: "Butterfly Sizu💟🦋 & Maruf System💫",
  description: "Activate/deactivate GF mode per user",
  commandCategory: "love",
  usages: "gfmode on/off (reply to user)",
  cooldowns: 5,
};

if (!global.gfmode) global.gfmode = {};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, messageReply } = event;

  const adminOnlyUID = ["100070782965051"];
  if (!adminOnlyUID.includes(senderID))
    return api.sendMessage("⛔ এই কমান্ড শুধু অ্যাডমিন ব্যবহার করতে পারবে!", threadID, messageID);

  const targetID = messageReply ? messageReply.senderID : senderID;
  const mode = args[0]?.toLowerCase();

  if (!["on", "off"].includes(mode))
    return api.sendMessage("⚠️ ব্যবহার করো: gfmode on/off (reply দিয়ে)", threadID, messageID);

  global.gfmode[targetID] = mode === "on";
  return api.sendMessage(
    mode === "on"
      ? `❤️ GF Mode activated for UID: ${targetID}`
      : `💔 GF Mode deactivated for UID: ${targetID}`,
    threadID,
    messageID
  );
};
