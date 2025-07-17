module.exports.config = {
    name: "ckbot",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Butterfly Sizu💟🦋 & Maruf System💫",
    description: "Check user, group, and admin info with photo.",
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
    const threadSetting = global.data.threadData.get(parseInt(event.threadID)) || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    // ADMIN INFO SECTION
    if (args[0] == "admin") {
        const adminUID = "100070782965051";
        const adminName = "Maruf Billah";
        const adminFB = "https://facebook.com/100070782965051";
        const adminMsg =
`———»ADMIN BOT«———
❯ Name: ${adminName}
❯ Facebook: ${adminFB}
❯ Thanks for using ${global.config.BOTNAME} bot`;

        const imgPath = __dirname + "/cache/1.png";
        const picUrl = `https://graph.facebook.com/${adminUID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

        const callback = () => api.sendMessage(
            { body: adminMsg, attachment: fs.createReadStream(imgPath) },
            event.threadID,
            () => fs.unlinkSync(imgPath)
        );
        return request(encodeURI(picUrl)).pipe(fs.createWriteStream(imgPath)).on("close", callback);
    }

    // GROUP INFO SECTION
    if (args[0] == "box") {
        let threadInfo = await api.getThreadInfo(event.threadID);
        let img = threadInfo.imageSrc;
        let males = 0, females = 0;
        threadInfo.userInfo.forEach(u => {
            if (u.gender == "MALE") males++;
            else if (u.gender == "FEMALE") females++;
        });
        const infoMsg =
`Group name: ${threadInfo.threadName}
TID: ${event.threadID}
Approved: ${threadInfo.approvalMode ? "On" : "Off"}
Emoji: ${threadInfo.emoji}
Members: ${threadInfo.participantIDs.length}
Admins: ${threadInfo.adminIDs.length}
Boys: ${males}
Girls: ${females}
Messages: ${threadInfo.messageCount}`;
        if (!img) return api.sendMessage(infoMsg, event.threadID, event.messageID);

        const imgPath = __dirname + "/cache/box.png";
        const callback = () => api.sendMessage(
            { body: infoMsg, attachment: fs.createReadStream(imgPath) },
            event.threadID,
            () => fs.unlinkSync(imgPath),
            event.messageID
        );
        return request(encodeURI(img)).pipe(fs.createWriteStream(imgPath)).on("close", callback);
    }

    // USER INFO SECTION
    if (args[0] == "user") {
        let id;
        if (!args[1]) {
            if (event.type == "message_reply") id = event.messageReply.senderID;
            else id = event.senderID;
        } else if (args[1].startsWith("@") && event.mentions) {
            id = Object.keys(event.mentions)[0];
        } else {
            id = args[1];
        }
        let data = await api.getUserInfo(id);
        let u = data[id];
        let url = u.profileUrl;
        let b = u.isFriend ? "Yes!" : "No!";
        let sn = u.vanity || "N/A";
        let name = u.name;
        let gender = u.gender == 2 ? "Male" : u.gender == 1 ? "Female" : "Other";

        // Profile message
        const userMsg =
`Name: ${name}
Facebook: ${url}
User name: ${sn}
UID: ${id}
Gender: ${gender}
Make friends with bots: ${b}`;

        // Load Profile Pic
        const imgPath = __dirname + "/cache/userpic.png";
        const picUrl = `https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

        const callback = () => api.sendMessage(
            { body: userMsg, attachment: fs.createReadStream(imgPath) },
            event.threadID,
            () => fs.unlinkSync(imgPath),
            event.messageID
        );
        return request(encodeURI(picUrl)).pipe(fs.createWriteStream(imgPath)).on("close", callback);
    }

    // HELP SECTION
    return api.sendMessage(
        `You can use:
${prefix}ckbot user — get your info
${prefix}ckbot user @[Tag] — info of tagged user
${prefix}ckbot user [uid] — info by UID
${prefix}ckbot box — group info
${prefix}ckbot admin — bot admin info`,
        event.threadID,
        event.messageID
    );
};
