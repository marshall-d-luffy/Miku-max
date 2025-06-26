const axios = require('axios');
module.exports = {
config: {
	name: "aicheck",
	aliases: ["ac", "aidetect"],
	author: "Tawsif~",
	role: 0,
	countDown: 10,
	category: "ai",	shortDescription: { en: "check if the image is Ai Generated or not"
},
	guide: { en: "aicheck <reply to an image>"
}
},
onStart: async function({ event, message }) {
if (!event?.messageReply || !event?.messageReply?.attachments[0]?.url) {
return message.reply("You must reply to an image");
}
try {
const imageUrl = event.messageReply.attachments[0].url;
const res = await axios.get('https://api.sightengine.com/1.0/check.json', {
  params: {
    'url': imageUrl,
    'models': 'genai',
    'api_user': '1658327623',
    'api_secret': 'f4TukWv67ZftZKxAtFYHp5ZDDD8QxkAj',
  }
});
if (!res?.data?.type?.ai_generated) { return message.reaction("❌", event.messageID);
}
const output = res.data.type.ai_generated;
message.reply({ body: `The image is ${Math.floor(output * 100)}% Ai generated`
});
message.reaction("✅", event.messageID);
} catch (e) {
message.reaction("❌", event.messageID);
		}
	}
}