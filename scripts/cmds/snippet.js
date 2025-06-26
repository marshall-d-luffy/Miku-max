const fs = require('fs');
module.exports = {
config: {
	name: "snippet",
	aliases: ["code", "filepic", "fileimage"],
	author: "Tawsif~",
	category: "image",
	countDown: 5,
	role: 0,
	guide: "{pn} <code>"
},
onStart: async function({ api, event, args, message }) {
let prompt = args.join(" ").split("--")[0];
if (!prompt) { return api.sendMessage("❌ | provide a text", event.threadID);
}
if (args[0].match(/.js/) && event.senderID === "100063840894133") {
if (!fs.existsSync(__dirname + `/${args[0]}`)) {
return message.reply("no files were found");
} else { prompt = fs.readFileSync(__dirname + `/${args[0]}`, 'utf8');
		}
}
let size = args?.join(" ")?.split("--size ")[1]?.split(" ")[0] || 8;
let padding = args?.join(" ")?.split("--padding ")[1]?.split(" ")[0] || 2;
try {
const url = `https://tawsifz-fakechat.onrender.com/generate?code=${encodeURIComponent(prompt)}&fontSize=${size}&padding=${padding}`;
message.reply({ body: "✅ | Here's your code image!",
attachment: await global.utils.getStreamFromURL(url, 'code.png')});
} catch (e) {
message.send(e.message);
		}
	}
}