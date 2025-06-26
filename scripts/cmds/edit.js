
const axios = require('axios');
module.exports = {
config: {
	name: "edit",
	author: "Tawsif~",
	category: "image",
	countDown: 5,
	role: 0,
	guide: { en: "edit <prompt> | reply to image"
}
},
onStart: async function({ message, event, args }) {
const prompt = args.join(" ");
if (!event.messageReply || !event?.messageReply?.attachments[0]?.url) { return message.reply('reply to an image');
} else if (!prompt) { return message.reply("❌ | provide a prompt");
}
const replyImageUrl = event.messageReply.attachments[0].url;	message.reaction("⏳", event.messageID);
try {
		let url = `https://tawsifz-gemini.onrender.com/edit?texts=${encodeURIComponent(prompt)}&url=${encodeURIComponent(replyImageUrl)}`;

const res = await axios.get(url, { responseType: 'stream'});
if (!res.headers['content-type'].includes('image/')) { return message.reaction("❌", event.messageID);
}
await message.reply({ attachment: res.data, body: `✅ | image Edited`,
});

	message.reaction("✅", event.messageID);
} catch (error) { message.send("❌ | " + error.message);
		}
	}
}