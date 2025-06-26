const axios = require('axios');
const t = require('tinyurl');
module.exports = {
config: {
	name: "art",
	author: "Kazi Jabid Hasan",
	category: "image",
	countDown: 10,
	role: 0,
	shortDescription: { en: "generate anime style image"
},
	guide: { en: "art <reply to an image>"
}
},
onStart: async function({ message, event, args }) {
if (!event?.messageReply || !event?.messageReply?.attachments[0]?.url) { return message.reply("You must reply to an image");
}
const prompt = args.join(" ") || "masterpiece";
let seed;
let weight;
if (prompt.match(/--seed/)) { seed = prompt.split("--seed ")[1];
}
if (prompt.match(/--weight/)) { weight = prompt.split("--weight ")[1];
}
const img = event.messageReply.attachments[0];
let { width, height } = img;
let ratio;
const max = 1536;
if (width > height) { ratio = height / width;
width = 1536;
height = 1536 * ratio;
} else if (height > width) { ratio = width / height;
height = 1536;
width = 1536 * ratio;
} else { width = 1536;
height = 1536;
}
	message.reaction("⏳", event.messageID);
try {
		let url = `https://seaart.onrender.com/art?imageUrl=${encodeURIComponent(img.url)}&w=${Math.floor(width)}&h=${Math.floor(height)}&weight=`;
url += prompt.match(/--seed/) ? seed : "";
url += prompt.match(/--weight/) ? weight : "";
const response = (await axios.get(url)).data.data.items[0].img_uris[0].url;
const output = await message.reply({
attachment: await global.utils.getStreamFromURL(response, 'art.png'),
body: `✅ | Here's your Art ✨`});

	message.reaction("✅", event.messageID);
global.GoatBot.onReply.set(output.messageID, {
        commandName: this.config.name,
        messageID: output.messageID,
        response,
        author: event.senderID
      });
} catch (error) { message.send("❌ | " + error.message);
		}
	},
onReply: async function({ message, event }) {
const { body } = event;
const d = global.GoatBot.onReply.get(event.messageReply.messageID);
if (d.author !== event.senderID) { return
} else if (body !== "U1") { return
}
message.send("⏳ | Upscale request added successfully...");
const t3 = new Date().getTime();
const upscalerUrl = await axios.get(`https://seaart.onrender.com/upscale?url=${encodeURIComponent(d.response)}`);
const shortenUrl = await t.shorten(upscalerUrl.data.data.items[0].img_uris[0].url);
await message.reply({ attachment: await global.utils.getStreamFromURL(upscalerUrl.data.data.items[0].img_uris[0].url, 'xl.png'),
body: `✅ | image upscaled\n🕔 | time taken: ${(new Date().getTime() - t3) / 1e3}\n URL: ${shortenUrl}`});
	}
}