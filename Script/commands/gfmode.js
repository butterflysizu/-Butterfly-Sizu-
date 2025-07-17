module.exports.config = {
  name: "gfmode",
  version: "1.0.0",
  hasPermssion: 2, // ✅ Only admin can use
  credits: "Butterfly Sizu💟🦋 & Maruf System💫",
  description: "Activate/deactivate GF mode per user",
  commandCategory: "love",
  usages: "gfmode on/off",
  cooldowns: 5
};

if (!global.gfmode) global.gfmode = {};

module.exports.run = async function ({ api, event, args }) {
  const { senderID, messageReply } = event;

  // ✅ Check if user is admin
  const allowedUID = ["100070782965051"]; // Maruf UID only
  if (!allowedUID.includes(senderID))
    return api.sendMessage("❌ GF Mode command is only for admin!", event.threadID);

  // ✅ Determine target user
  const targetID = messageReply ? messageReply.senderID : senderID;

  // ✅ Toggle mode
  const type = args[0];
  if (type === "on") {
    global.gfmode[targetID] = true;
    return api.sendMessage(`💖 GF Mode activated for UID: ${targetID}`, event.threadID);
  } else if (type === "off") {
    global.gfmode[targetID] = false;
    return api.sendMessage(`💔 GF Mode deactivated for UID: ${targetID}`, event.threadID);
  } else {
    return api.sendMessage("⚠️ Use: gfmode on/off", event.threadID);
  }
};
