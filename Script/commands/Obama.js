module.exports.config = {
  name: "obama",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "💫Butterfly🦋 Sizu💟 & Maruf System💫",
  description: "Obama Tweet post",
  commandCategory: "edit-img",
  usages: "[text]",
  cooldowns: 10,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
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
};

module.exports.run = async function ({ api, event, args }) {
  const fs = require("fs-extra");
  const axios = require("axios");
  const { loadImage, createCanvas } = require("canvas");
  const path = __dirname + "/cache/obama.png";

  const text = args.join(" ");
  if (!text) return api.sendMessage("⚠️ Type something for Obama to tweet!", event.threadID, event.messageID);

  try {
    const response = await axios.get("https://i.imgur.com/6fOxdex.png", { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));

    const baseImage = await loadImage(path);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "400 45px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";

    let fontSize = 45;
    while (ctx.measureText(text).width > 1000) {
      fontSize--;
      ctx.font = `400 ${fontSize}px Arial`;
    }

    const lines = await this.wrapText(ctx, text, 1160);
    ctx.fillText(lines.join('\n'), 60, 165); // Obama comment position

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(path, imageBuffer);
    return api.sendMessage({ attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
  } catch (err) {
    console.error("Obama command error:", err);
    return api.sendMessage("❌ Something went wrong while generating the image.", event.threadID, event.messageID);
  }
};
