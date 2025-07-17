module.exports.config = {
  name: "acp",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Butterfly Sizu💟🦋 & Maruf System💫",
  description: "Make friends via Facebook id",
  commandCategory: "bot id",
  usages: "uid",
  cooldowns: 0
};

module.exports.handleReply = async ({ handleReply, event, api }) => {
  const { author, listRequest } = handleReply;
  if (author != event.senderID) return;

  const args = event.body.trim().split(" ");
  const action = args[0].toLowerCase();
  let targetIDs = args.slice(1);

  if (action !== "add" && action !== "del") {
    return api.sendMessage(
      '⚠️ Please choose `add` or `del`, like:\n👉 add 1\n👉 del all',
      event.threadID,
      event.messageID
    );
  }

  if (args[1] == "all") {
    targetIDs = listRequest.map((_, i) => (i + 1).toString());
  }

  const success = [];
  const failed = [];

  for (const stt of targetIDs) {
    const user = listRequest[parseInt(stt) - 1];
    if (!user) {
      failed.push(`❌ Not found: ${stt}`);
      continue;
    }

    const variables = {
      input: {
        source: "friends_tab",
        actor_id: api.getCurrentUserID(),
        client_mutation_id: Math.round(Math.random() * 19).toString()
      },
      scale: 3,
      refresh_num: 0
    };

    if (action === "add") {
      variables.input.friend_requester_id = user.node.id;
    } else if (action === "del") {
      variables.input.friend_request_id = user.node.id;
    }

    const form = {
      av: api.getCurrentUserID(),
      fb_api_caller_class: "RelayModern",
      fb_api_req_friendly_name: action === "add" ?
        "FriendingCometFriendRequestConfirmMutation" :
        "FriendingCometFriendRequestDeleteMutation",
      doc_id: action === "add" ? "3147613905362928" : "4108254489275063",
      variables: JSON.stringify(variables)
    };

    try {
      const res = await api.httpPost("https://www.facebook.com/api/graphql/", form);
      const json = JSON.parse(res);
      if (json.errors) failed.push(user.node.name);
      else success.push(user.node.name);
    } catch (e) {
      failed.push(user.node.name);
    }
  }

  api.sendMessage(
    `${success.map(name => `✅ Successfully ${action === 'add' ? 'added' : 'removed'} "${name}" in my friend list`).join("\n")}` +
    `${failed.length > 0 ? `\n\n❌ Failed:\n${failed.map(n => `- ${n}`).join("\n")}` : ""}`,
    event.threadID,
    event.messageID
  );
};
