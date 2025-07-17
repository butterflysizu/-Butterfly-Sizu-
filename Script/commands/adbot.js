module.exports.config = {
    name: "ckbot",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Butterfly Sizu💟🦋 & Maruf System💫",
    description: "Show user FB info in clean style",
    commandCategory: "Media",
    usages: "",
    cooldowns: 4,
    dependencies: {
        "request": "",
        "fs": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];

    // USER INFO
    if (args[0] == "user") {
        let id;
        if (!args[1]) {
            if (event.type == "message_reply") id = event.messageReply.senderID;
            else id = event.senderID;
        } else if (args[1].startsWith("@") && event.mentions && Object.keys(event.mentions).length > 0) {
            id = Object.keys(event.mentions)[0];
        } else {
            id = args[1];
        }
        let data = await api.getUserInfo(id);
        let u = data[id];
        let name = u.name || "N/A";
        let sn = u.vanity || "N/A";
        let fbUrl = `https://facebook.com/${id}`;
        let isFriend = u.isFriend === false ? "No" : u.isFriend === true ? "Yes" : "Unknown";
        let gender = "Unknown";
        if (u.gender == 2) gender = "Male";
        else if (u.gender == 1) gender = "Female";

        // Minimal final message, no extra/long URL
        const userMsg =
`Name: ${name}
Facebook: ${fbUrl}
User name: ${sn}
UID: ${id}
Gender: ${gender}
Make friends with bots: ${isFriend}!`;

        // Only profile pic
        const imgUrl = `https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const imgPath = __dirname + "/cache/profilepic.png";
        request(encodeURI(imgUrl)).pipe(fs.createWriteStream(imgPath)).on('close', () => {
            api.sendMessage({
                body: userMsg,
                attachment: fs.createReadStream(imgPath)
            }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);
        });
        return;
    }

    // ADMIN info
    if (args[0] == "admin") {
        const adminId = "100070782965051";
        const adminImg = `https://graph.facebook.com/${adminId}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const imgPath = __dirname + "/cache/adminpic.png";
        const adminMsg =
`———»ADMIN BOT«———
❯ Name: Maruf Billah
❯ Facebook: https://facebook.com/100070782965051
❯ Thanks for using 💫Butterfly🦋 Sizu💟 bot`;
        request(encodeURI(adminImg)).pipe(fs.createWriteStream(imgPath)).on('close', () => {
            api.sendMessage({
                body: adminMsg,
                attachment: fs.createReadStream(imgPath)
            }, event.threadID, () => fs.unlinkSync(imgPath));
        });
        return;
    }

    // Help message
    return api.sendMessage(
        `You can use:\n\n${global.config.PREFIX}${this.config.name} user => Show your own info\n${global.config.PREFIX}${this.config.name} user @[Tag] => Tag friend's info\n${global.config.PREFIX}${this.config.name} user [uid] => Specific user's info\n${global.config.PREFIX}${this.config.name} admin => Admin Bot's Personal Info`,
        event.threadID, event.messageID
    );
};
