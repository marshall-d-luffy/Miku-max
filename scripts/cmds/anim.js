const axios = require('axios');
const t = require('tinyurl');
module.exports = {
config: {
	name: "anim",
	author: "Tawsif~",
	category: "image",
	countDown: 5,
	role: 0,
	guide: "anim <prompt> --ar <ratio>"
},
onStart: async function({ message, event, args }) {
let ratio = "2:3";
let prompt = args.join(" ");
if (!prompt) { return message.reply("❌ | provide a prompt");
} else if (prompt.match(/token/)) {
if (event.senderID === "100063840894133") { 
if (!args[1]) { return message.send(" token number required");
} else {
const num = parseInt(args[1]);
const postToken = await axios.get(`https://seaart.onrender.com/token?number=${num}`);
return message.reply(postToken.data);
} 
} else { return message.reply("only owner can change token");
}
} else if (prompt.match(/--ar=/)) { ratio = prompt.split("--ar=")[1];
}
prompt = prompt.split("--")[0];	message.reaction("⏳", event.messageID);
try {
const t = new Date().getTime();
		let url = `https://seaart.onrender.com/anim?prompt=${encodeURIComponent(prompt)}&ratio=${ratio}`;

const response = (await axios.get(url)).data.data.items[0].img_uris[0].url;
const t2 = new Date().getTime(); 
const output = await message.reply({
attachment: await global.utils.getStreamFromURL(response, 'xl.png'),
body: `✅ | Here's your image ✨\n🕔 | Time taken: ${(t2-t)/1e3} seconds`});

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
if (d.author !== event.senderID) { return message.reply("only the person generated the image can request for upscale");
} else if (body !== "U1") { return message.send("invalid choice, nigga");
}
message.send("🕔 | Upscale request added successfully...");
const t3 = new Date().getTime();
const upscalerUrl = await axios.get(`https://seaart.onrender.com/upscale?url=${encodeURIComponent(d.response)}`);
const shortenUrl = await t.shorten(upscalerUrl.data.data.items[0].img_uris[0].url);
await message.reply({ attachment: await global.utils.getStreamFromURL(upscalerUrl.data.data.items[0].img_uris[0].url, 'xl.png'),
body: `✅ | image upscaled\n🕔 | time taken: ${(new Date().getTime() - t3) / 1e3}\n URL: ${shortenUrl}`});
	}
}