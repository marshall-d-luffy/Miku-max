const axios = require('axios');
module.exports = {
config: {
	name: "fastgen",
	aliases: ["gen"],
	author: "Tawsif~",
	role: 0,
	countDown: 10,
	category: "image",	shortDescription: { en: "generate flux image"
},
	guide: { en: "gen <prompt>"
}
},
onStart: async function({ event, message, args }) { 
let prompt = args.join(" ");
let ratio = "1:1";
if (!prompt) { return message.reply("❌ | provide a prompt");
} else if (prompt.match(/--ar/)) { ratio = prompt?.split("--ar=")[1]?.split(" ")[0] || prompt?.split("--ar ")[1]?.split(" ")[0];
}
let count = prompt?.split("--count=")[1]?.split(" ")[0] || prompt?.split("--count ")[1]?.split(" ")[0] || 1;
prompt = prompt.split("--")[0];
try {
let imgs = [];
for(i=0;i<count;i++) {
let url = (await axios.get(`https://www.ai4chat.co/api/image/generate?prompt=${encodeURIComponent(prompt)}&aspect_ratio=${encodeURIComponent(ratio)}`)).data.image_link;
let stream = await global.utils.getStreamFromURL(url, `gen_${i}.png`);
imgs.push(stream);
}
message.reply({ body: "✅ | Here's your image",
attachment: imgs
});
} catch (e) { 
message.send(e.message);
		}
	}
}