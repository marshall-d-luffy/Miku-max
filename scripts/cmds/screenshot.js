const axios = require('axios');
module.exports = {
config: {
	name: "ss",
	aliases: ['screenshot'],
	author: "Tawsif~",
	category: "image",
	countDown: 5,
	role: 0,
	guide: "ss <url> --ar=<ratio> | --d (dark mode) |  --f (full page) | blank"
},
onStart: async function({ event, args, message }) {
let prompt = args.join(" ");
if (!prompt) { return message.reply("❌ | provide a URL");
}
	
let ratio = "16:9";
if (prompt.match(/--ar/)) { ratio = prompt.split("--ar=")[1];
}
let dark = 'false';
if (prompt.match(/--d/)) {
dark = 'true';
}
let fullpage = 'false';
if (prompt.match(/--f/)) { fullpage = 'true';
			 }
prompt = args[0];
	message.reaction("⏳", event.messageID);
try {
		let url = `https://tawsifs-screenshot.onrender.com/screenshot?url=${encodeURIComponent(prompt)}&fullpage=${fullpage}&dark=${dark}&ratio=${ratio}`;
message.reply({
attachment: await global.utils.getStreamFromURL(url, 'ss.png')});
	message.reaction("✅", event.messageID);
} catch (error) { message.send("❌ | " + error.message);
		}
	}
}