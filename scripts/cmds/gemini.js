const axios = require('axios');
const fs = require('fs');
const base = "https://tawsifz-gemini.onrender.com";
module.exports = {
config: {
	name: "gemini",
	author: "Tawsif~",
	category: "image",
	countDown: 5,
	role: 0,
	shortDescription: { en: "chat with gemini 2.0 flash"},
	guide: { en: "gemini  <texts>"}
},
onStart: async function({ message, event, args }) {
let prompt = args.join(" ");
if (event?.messageReply && event?.messageReply?.attachments[0]?.url) { 
url = base + `/edit?url=${encodeURIComponent(event.messageReply.attachments[0].url)}&texts=${encodeURIComponent(prompt || "what / who is it?")}`;
} else { url = base + `/chat?texts=${encodeURIComponent(prompt || "hi")}`;
}
try {
		const res = await axios.get(url, { responseType: 'arraybuffer',
headers: { "Accept": 'image/png, text/plain'}
});
if (res.headers['content-type'].includes('image/')) { 
const writer = fs.writeFileSync('./gemini.png', Buffer.from(res.data, 'binary'));
message.reply({
attachment: fs.createReadStream('./gemini.png')});
fs.unlinkSync('./gemini.png');
} else { 
let parsedRes = res.data.includes(`"success":true,`) ?JSON.parse(res.data) : res.data;
const msg = parsedRes?.text || parsedRes;
message.reply({ body: msg.toString().split("*")?.join("")});
	}
} catch (error) { message.send("❌ | " + error.message);
		}
	}
}