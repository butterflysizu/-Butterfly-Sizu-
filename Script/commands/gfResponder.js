module.exports = async function ({ api, event }) {
  const { senderID, body, threadID } = event;
  const lower = body?.toLowerCase();

  if (!global.gfmode?.[senderID]) return;

  const responses = {
    "i love you": "Aww 🥰 I love you more, jaan!",
    "miss you": "I’m right here baby, never gone 💞",
    "hello": "Hey love! 🌸",
    "good night": "Sweet dreams my moonlight 💫",
    "good morning": "Rise and shine, sunshine 🌞"
  };

  const matched = Object.keys(responses).find(key => lower?.includes(key));
  if (matched) {
    return api.sendMessage(responses[matched], threadID);
  }
};
