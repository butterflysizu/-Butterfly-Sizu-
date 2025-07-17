module.exports.config = {
    name: "ckbot",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Butterfly Sizu💟🦋 & Maruf System💫",
    description: "Check bot user & group info",
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

    // Help menu
    if (args.length == 0) {
        return api.sendMessage(
            `You can use:\n\n${prefix}${this.config.name} user => Your own info\n${prefix}${this.config.name} user @[Tag] => Friend info by tag\n${prefix}${this.config.name} box => Group info\n${prefix}${this.config.name} admin => Admin Bot's Personal Info`,
            event.threadID, event.messageID
        );
    }

    // Group/box info
    if (args[0] == "box") {
        let threadInfo = args[1] ? await api.getThreadInfo(args[1]) : await api.getThreadInfo(event.threadID);
        let img = threadInfo.imageSrc;
        var gendernam = [];
        var gendernu = [];
        for (let z in threadInfo.userInfo) {
            var g = threadInfo.userInfo[z].gender;
            if (g == "MALE") gendernam.push(g);
            else gendernu.push(g);
        }
        var nam = gendernam.length;
        var nu = gendernu.length;
        let sex = threadInfo.approvalMode;
        var pd = sex == false ? "Turn off" : sex == true ? "Turn on" : "N/A";
        const msg =
            `Group name: ${threadInfo.threadName}\nTID: ${args[1] || event.threadID}\nApproved: ${pd}\nEmoji: ${threadInfo.emoji}\nInfo:\n» ${threadInfo.participantIDs.length} members & ${threadInfo.adminIDs.length} admins\n» Including ${nam} boys & ${nu} girls\n» Total messages: ${threadInfo.messageCount}.`;

        if (!img) return api.sendMessage(msg, event.threadID, event.messageID);

        const callback = () => api.sendMessage({ body: msg, attachment: fs.createReadStream(__dirname + "/cache/1.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
        return request(encodeURI(img)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', callback);
    }

    // Admin info
    if (args[0] == "admin") {
        var callback = () => api.sendMessage(
            {
                body: `———»ADMIN BOT«———\n❯ Name: Maruf Billah\n❯ Facebook: https://facebook.com/100070782965051\n❯ Thanks for using 💫Butterfly🦋 Sizu💟 bot`,
                attachment: fs.createReadStream(__dirname + "/cache/1.png")
            }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
        return request(encodeURI(`https://graph.facebook.com/100070782965051/picture?height=720&width=720`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', callback);
    }

    // User info (self, reply, tag, or UID)
    if (args[0] == "user") {
        let id;
        if (!args[1]) {
            if (event.type == "message_reply") id = event.messageReply.senderID;
            else id = event.senderID;
        } else if (args.join().indexOf('@') !== -1) {
            id = Object.keys(event.mentions)[0];
        } else {
            id = args[1];
        }
        let data = await api.getUserInfo(id);
        data = data[id];

        let name = data.name || "N/A";
        let username = data.vanity || "N/A";
        let uid = id;
        let gender = data.gender == 2 ? "Male" : data.gender == 1 ? "Female" : "Other";
        let isFriend = data.isFriend == true ? "Yes" : "No";
        let profileLink = data.profileUrl ? data.profileUrl : `https://facebook.com/${uid}`;
        let thumbSrc = data.thumbSrc || `https://graph.facebook.com/${uid}/picture?height=720&width=720`;

        let info =
            `Name: ${name}\n` +
            `Facebook: ${profileLink}\n` +
            `User name: ${username}\n` +
            `UID: ${uid}\n` +
            `Gender: ${gender}\n` +
            `Make friends with bots: ${isFriend}`;

        const callback = () => api.sendMessage(
            {
                body: info,
                attachment: fs.createReadStream(__dirname + "/cache/1.png")
            }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID
        );
        return request(encodeURI(thumbSrc)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', callback);
    }
};
