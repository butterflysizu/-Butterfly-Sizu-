module.exports.config = {
  name: "anhdaden",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Butterfly Sizu💟🦋 & Maruf System💫",
  description: "কাস্টম মিম ইমেজ বানাও — দুই লাইনে লেখো",
  commandCategory: "Edit-IMG",
  usages: "[উপরের টেক্সট] | [নিচের টেক্সট]",
  cooldowns: 10
};

// টেক্সটকে একাধিক লাইনে ভেঙে ফেলার হেল্পার ফাংশন
module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise((resolve) => {
    if (!text) return resolve([""]);
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    const words = text.split(" ");
    const lines = [];
    let line = "";
    while (words.length > 0) {
      if (ctx.measureText(line + words[0]).width < maxWidth) {
        line += words.shift() + " ";
      } else {
        lines.push(line.trim());
        line = "";
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const { loadImage, createCanvas, registerFont } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const pathImg = __dirname + `/cache/anhdaden.png`;
  const fontPath = __dirname + "/cache/SVN-Arial-2.ttf";

  // ফন্ট ডাউনলোড/লোড
  if (!fs.existsSync(fontPath)) {
    let getfont = (await axios.get(
      `https://github.com/ButterflyBots/font-repo/raw/main/SVN-Arial-2.ttf`,
      { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(fontPath, Buffer.from(getfont, "utf-8"));
  }
  registerFont(fontPath, { family: "SVN-Arial-2" });

  // ইমেজ ডাউনলোড
  let getImage = (
    await axios.get("https://i.imgur.com/2ggq8wM.png", {
      responseType: "arraybuffer"
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getImage, "utf-8"));

  // আর্গুমেন্ট চেক
  if (!args[0] || !args.join(" ").includes("|")) {
    return api.sendMessage(
      "❗️ উদাহরণ:\n.anhdaden আমার ভাই | বস মানুষ!",
      threadID,
      messageID
    );
  }

  // টেক্সট ভাঙা
  const [text1, text2] = args.join(" ").split("|").map(s => s.trim());

  // ক্যানভাস তৈরি
  let baseImage = await loadImage(pathImg);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.font = "30px SVN-Arial-2";
  ctx.fillStyle = "#000077";
  ctx.textAlign = "center";

  // টেক্সট র‍্যাপ ও বসানো
  const line1 = await this.wrapText(ctx, text1, 400);
  const line2 = await this.wrapText(ctx, text2, 400);
  ctx.fillText(line1.join("\n"), 170, 140);
  ctx.fillText(line2.join("\n"), 170, 440);

  // ছবি সেন্ড
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  api.sendMessage(
    { attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
