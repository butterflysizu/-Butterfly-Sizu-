module.exports.config = {
	name: "obama",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Butterfly Sizu💟🦋 & Maruf System💫",
	description: "Obama Tweet post",
	commandCategory: "edit-img",
	usages: "[text]",
	cooldowns: 10,
	dependencies: {
		"canvas":"",
		"axios":"",
		"fs-extra":""
	}
};

module.exports.wrapText = (ctx, text, maxWidth) => {
	return new Promise(resolve => {
		if (ctx.measureText(text).width < maxWidth) return resolve([text]);
		if (ctx.measureText('W').width > maxWidth) return resolve(null);
		const words = text.split(' ');
		const lines = [];
		let line = '';
		while (words.length > 0) {
			let split = false;
			while (ctx.measureText(words[0]).width >= maxWidth) {
				const temp = words[0];
				words[0] = temp.slice(0, -1);
				if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
				else {
					split = true;
					words.splice(1, 0, temp.slice(-1));
				}
			}
			if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
			else {
				lines.push(line.trim());
				line = '';
			}
			if (words.length === 0) lines.push(line.trim());
		}
		return resolve(lines);
	});
} 

module.exports.run = async function({ api, event, args }) {
	const { loadImage, createCanvas, registerFont } = require("canvas");
	const fs = global.nodemodule["fs-extra"];
	const axios = global.nodemodule["axios"];
	const path = require("path");

	let pathImg = __dirname + '/cache/trump.png';
	let fontPath = __dirname + '/cache/arial-unicode.ttf';
	let text = args.join(" ");
	if (!text) return api.sendMessage("📌 লিখো কী লিখবে বোর্ডে!", event.threadID, event.messageID);

	// ✅ Download Unicode font once
	if (!fs.existsSync(fontPath)) {
		const fontFile = (await axios.get("https://github.com/matomo-org/travis-scripts/raw/master/fonts/arial-unicode-ms.ttf", { responseType: 'arraybuffer' })).data;
		fs.writeFileSync(fontPath, Buffer.from(fontFile, "utf-8"));
	}
	registerFont(fontPath, { family: "ArialUnicode" });

	// ✅ Load base image
	let getImg = (await axios.get("https://i.imgur.com/6fOxdex.png", { responseType: 'arraybuffer' })).data;
	fs.writeFileSync(pathImg, Buffer.from(getImg, 'utf-8'));

	let baseImage = await loadImage(pathImg);
	let canvas = createCanvas(baseImage.width, baseImage.height);
	let ctx = canvas.getContext("2d");

	ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

	// 🧠 Smart font size with Unicode support
	let fontSize = 45;
	ctx.font = `${fontSize}px ArialUnicode`;
	ctx.fillStyle = "#000000";
	ctx.textAlign = "start";

	const lines = await this.wrapText(ctx, text, 1160);
	ctx.fillText(lines.join('\n'), 60, 165);

	const imageBuffer = canvas.toBuffer();
	fs.writeFileSync(pathImg, imageBuffer);

	return api.sendMessage({
		attachment: fs.createReadStream(pathImg)
	}, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);        
}
