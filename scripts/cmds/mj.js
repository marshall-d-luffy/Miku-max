const axios = require('axios');
const checkImageProgress = async (batchUrl, retries = 100, delay = 2000) => {
      for (let i = 0; i < retries; i++) {
try {
          const batch = await axios.get(batchUrl, {
headers: {
"x-api-key": "nexusXtawsif"
}});
          const taskItem = batch.data;
          if (taskItem.status === "SUCCESS") {
            return batch.data;
          }
          
          await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
          console.error(`Attempt ${i + 1} failed:`, error.message);
          // On last retry, throw the error
          if (i === retries - 1) {
            throw error;
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      throw new Error('Image processing did not complete after maximum retries');
    };
module.exports = {
config: {
	name: "midjourney",
	aliases: ["mj"],
	author: "Tawsif~ & AÌ Amin + Rishad APIs",
	category: "image",
	countDown: 30,
	role: 0,
	guide: "mj <prompt> --ar <ratio> --v <version> --cref <imageUrl>"
},
onStart: async function({ message, event, args }) {
let prompt = args.join(" ");
if (!prompt) { return message.reply("❌ | provide a prompt");
}
const ratio = prompt?.split("--ar=")[1]?.split(" ")[0] || prompt?.split("--ar ")[1]?.split(" ")[0] || "1:1";
let version = "7.0";
if (prompt.match(/--v/)) {
version = prompt?.split("--v ")[1]?.split(" ")[0];
} else if (prompt.match(/--niji/)) { 
version = "niji" + prompt?.split("--niji ")[1]?.split(" ")[0];
}
if (prompt.match(/--oref/)) { let ref = "--oref" + prompt?.split("--oref")[1]?.split(" ")[0];
prompt = prompt?.split("--")[0] + ref;
}
	message.reaction("⏳", event.messageID);
try {

const response = await axios.post('https://aiimagestudio.vercel.app/generate', 
  {
    prompt: encodeURIComponent(prompt),
    v: version,
    ratio: ratio
  },
  {
    headers: {
      "x-api-key": "nexusXtawsif",
      "Content-Type": "application/json"
    }
  });
const taskID = "" + `${response.data.taskId}`;
const token = response.data.token;
const batchUrl = `https://aiimagestudio.vercel.app/check/${taskID}?token=${token}`;
    const result = await checkImageProgress(batchUrl);
const output = await message.reply({
attachment: await global.utils.getStreamFromURL(result.imageUrl),
body: "✅ | Image Generated\nActions: [ U1, U2, U3, U4 ]"});

	message.reaction("✅", event.messageID);
global.GoatBot.onReply.set(output.messageID, {
        commandName: this.config.name,
        messageID: output.messageID,
		resData: JSON.stringify(result),
        author: event.senderID
      });
} catch (error) { message.send("❌ | " + error.message);
		}
	},
onReply: async function({ message, event }) {
const { body, senderID, messageID } = event;
const aButtons = [ "U1", "U2", "U3", "U4" ];
const d = global.GoatBot.onReply.get(event.messageReply.messageID);
if (d.author !== senderID) { return 
} else if (!aButtons.includes(body)) { return message.send("invalid choice, nigga");
}
const pr = JSON.parse(d.resData);
const choice = parseInt(body.split("U")[1]) - 1;
const customID = pr.buttons[choice].customId;
const taskID = "" + `${pr.id}`;
message.reaction("⏳", messageID);
const t = new Date().getTime();
try {
const uResponse = await axios.post("https://aiimagestudio.vercel.app/action", {
"customId": customID,
"taskId": taskID
},
{ headers: {
"x-api-key": "nexusXtawsif"
}
});
const uTaskID = ""+ `${uResponse.data.taskId}`;
const uToken = uResponse.data.token;
const uBatchUrl = `https://aiimagestudio.vercel.app/check/${uTaskID}?token=${uToken}`;
const uImage = await checkImageProgress(uBatchUrl);
const shortenUrl = await (require('tinyurl')).shorten(uImage.imageUrl);
message.reply({ attachment: await global.utils.getStreamFromURL(uImage.imageUrl),
body: `✅ | Image Upscaled\n⏳ | time taken: ${(new Date().getTime() - t) / 1e3}\n URL: ${shortenUrl}`});
} catch (e) { message.send("❌ | Upscale request failed\n"+ e.message);
		}
	}
}