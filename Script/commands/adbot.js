module.exports.config = {
    name: "ckbot",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Butterfly Sizu💟🦋 & Maruf System💫",
    description: "Bot & User info command",
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

    // Help Message
    if (args.length == 0) 
        return api.sendMessage(
            `You can use:\n\n${prefix}${this.config.name} user => Your info.\n${prefix}${this.config.name} user @[Tag] => Tag user's info.\n${prefix}${this.config.name} box => Group info.\n${prefix}${this.config.name} admin => Admin info.`,
            event.threadID, event.messageID
        );

    // Admin Info
    if (args[0] == "admin") {
        const adminName = "Maruf Billah";
        const adminUID = "100070782965051";
        const adminFB = "https://facebook.com/100070782965051";
        const botName = "💫Butterfly🦋 Sizu💟";
        const callback = () => api.sendMessage(
            {
                body: `———»ADMIN BOT«———\n❯ Name: ${adminName}\n❯ Facebook: ${adminFB}\n❯ Thanks for using ${botName} bot`,
                attachment: fs.createReadStream(__dirname + "/cache/1.png")
            }, event.threadID, () => {
                try { fs.unlinkSync(__dirname + "/cache/1.png"); } catch (e) {}
            }, event.messageID
        );
        return request(encodeURI(`https://graph.facebook.com/${adminUID}/picture?height=720&width=720`))
            .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
            .on('close', () => callback());
    }

    // Box Info
    if (args[0] == "box") {
        let threadInfo;
        if (args[1]) threadInfo = await api.getThreadInfo(args[1]);
        else threadInfo = await api.getThreadInfo(event.threadID);
        const img = threadInfo.imageSrc;
        let nam = 0, nu = 0;
        for (const user of threadInfo.userInfo) {
            if (user.gender == "MALE") nam++;
            else if (user.gender == "FEMALE") nu++;
        }
        const pd = threadInfo.approvalMode ? "Turn on" : "Turn off";
        const groupMsg = 
            `Group name: ${threadInfo.threadName}\nTID: ${threadInfo.threadID}\nApproved: ${pd}\nEmoji: ${threadInfo.emoji}\n` +
            `Members: ${threadInfo.participantIDs.length}\nAdmins: ${threadInfo.adminIDs.length}\nBoys: ${nam}\nGirls: ${nu}\n` +
            `Total messages: ${threadInfo.messageCount}.`;

        if (!img) return api.sendMessage(groupMsg, event.threadID, event.messageID);
        const callback = () => api.sendMessage({
            body: groupMsg,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, event.threadID, () => {
            try { fs.unlinkSync(__dirname + "/cache/1.png"); } catch (e) {}
        }, event.messageID);
        return request(encodeURI(img)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', callback);
    }

    // User Info
    if (args[0] == "user") {
        let id;
        // Tag
        if (args.join().indexOf('@') !== -1) {
            id = Object.keys(event.mentions)[0];
        }
        // Reply
        else if (event.type == "message_reply") {
            id = event.messageReply.senderID;
        }
        // UID argument
        else if (args[1]) {
            id = args[1];
        }
        // Self
        else {
            id = event.senderID;
        }

        let data = await api.getUserInfo(id);
        data = data[id];
        let url = data.profileUrl || "N/A";
        let b = data.isFriend == false ? "No" : data.isFriend == true ? "Yes" : "Unknown";
        let sn = data.vanity || "N/A";
        let name = data.name || "N/A";
        let gender = data.gender == 2 ? "Male" : data.gender == 1 ? "Female" : "Other";
        let uid = id;

        // Profile pic
        const callback = () => api.sendMessage({
            body: `Name: ${name}` +
                `\nUser url: ${url}` +
                `\nUser name: ${sn}` +
                `\nUID: ${uid}` +
                `\nGender: ${gender}` +
                `\nMake friends with bots: ${b}`,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, event.threadID, () => {
            try { fs.unlinkSync(__dirname + "/cache/1.png"); } catch (e) {}
        }, event.messageID);

        return request(encodeURI(`https://graph.facebook.com/${uid}/picture?height=720&width=720`))
            .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
            .on('close', callback);
    }
};
