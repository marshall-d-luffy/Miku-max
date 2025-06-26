const axios = require('axios');
module.exports = {
config: {
	name: "prompt",
	aliases: ["p"],
	author: "Tawsif~",
	category: "ai",
	countDown: 5,
	role: 0,
	guide: { en: "prompt <reply to image>"
	}
},
onStart: async function({ message, event, args }) {
if (!event.messageReply || !event?.messageReply?.attachments[0]?.url) { return message.reply('reply to an image');
}
const replyImageUrl = event.messageReply.attachments[0].url;
const r = await axios.get(replyImageUrl, {responseType: 'arraybuffer'});
  const base = Buffer.from(r.data, 'binary').toString('base64');
try {
const res = await axios.post('https://api.live3d.io/api/v1/generation/img2prompt', {
    image: `data:image/webp;base64, ${base}`,
    consume_points: 1
  }, {
    headers: {
      "accept": "application/json",
      "accept-language": "en-US,en;q=0.9",
      "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDczMDk2MTMsInN1YiI6ImVtYWlsIDM5MDI3NDEgaG9ycm9ycGxheXNwbHVzQGdtYWlsLmNvbSJ9.TpWi-pdvNgX-xie127Q1Zb1zrLKM6AmIGLJJiPC637U",
      "content-type": "application/json",
      "save-data": "on",
      "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\"",
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": "\"Android\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    referrer: "https://animegenius.live3d.io/",
    referrerPolicy: "strict-origin-when-cross-origin"
  });
const output = res?.data?.data;
if (!output) { return message.reply("error");
		}
  message.reply(`${output.replace(/_/g, " ")}`);
} catch (error) {
  message.send(error.message);
		}
	}
}