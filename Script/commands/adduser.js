module.exports.config = {
	name: "adduser",
	version: "2.4.3",
	hasPermssion: 0,
	credits: "Butterfly Sizu💟🦋 & Maruf System💫",
	description: "লিঙ্ক বা আইডি দিয়ে গ্রুপে নতুন মেম্বার এড করো",
	commandCategory: "group",
	usages: "[uid/link]",
	cooldowns: 5
};

// UID বের করার হেল্পার
async function getUID(url, api) {
	if (url.includes("facebook.com") || url.includes("fb.com")) {
		try {
			if (!url.startsWith("http")) url = "https://" + url;
			let data = await api.httpGet(url);
			let regex = /"userID":"(\d+)"/.exec(data);
			if (regex && regex[1]) return [regex[1], null, false];
			else return [null, null, true];
		} catch {
			return [null, null, true];
		}
	} else {
		return [url, null, false];
	}
}

module.exports.run = async function ({ api, event, args }) {
	const { threadID, messageID } = event;
	const botID = api.getCurrentUserID();
	const out = msg => api.sendMessage(msg, threadID, messageID);
	let { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
	participantIDs = participantIDs.map(e => parseInt(e));
	if (!args[0]) return out("একজন ইউজার আইডি বা প্রোফাইল লিঙ্ক দাও।");
	if (!isNaN(args[0])) return adduser(args[0]);
	else {
		try {
			var [id, name, fail] = await getUID(args[0], api);
			if (fail == true && id != null) return out(id);
			else if (fail == true && id == null) return out("ইউজার আইডি পাওয়া যায়নি!");
			else {
				await adduser(id);
			}
		} catch (e) {
			return out(`${e.name}: ${e.message}.`);
		}
	}

	async function adduser(id) {
		id = parseInt(id);
		if (participantIDs.includes(id)) return out("এই মেম্বার ইতিমধ্যে গ্রুপে আছে!");
		var admins = adminIDs.map(e => parseInt(e.id));
		try {
			await api.addUserToGroup(id, threadID);
		}
		catch {
			return out("বট ইউজারকে গ্রুপে এড করতে পারলো না (প্রোফাইল প্রাইভেট হতে পারে)।");
		}
		if (approvalMode === true && !admins.includes(botID)) return out("গ্রুপ অ্যাডমিন বট না, তাই এড করার জন্য লিস্টে এপ্রুভ করো।");
		else return out("সফলভাবে নতুন ইউজার গ্রুপে যোগ হয়েছে! 🎉");
	}
};
