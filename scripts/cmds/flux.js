const axios = require('axios');
const extractUrl = (data) => {
  const lines = data.split('\n');
  for (const line of lines) {
    if (line.includes('"status":"COMPLETED"') && line.includes('"url":')) {
      const urlMatch = line.match(/"url":"(.*?)"/);
      return urlMatch ? urlMatch[1] : null;
    }
  }
  return null;
};
module.exports = {
config: {
	name: "flux",
	aliases: ["imagine"],
	author: "Tawsif~",
	role: 0,
	countDown: 10,
	category: "image",	shortDescription: { en: "generate flux image"
},
	guide: { en: "flux <prompt>"
}
},
onStart: async function({ event, message, args }) { 
const prompt = args.join(" ");
let ratio = "1:1";
if (!prompt) { return message.reply("❌ | provide a prompt");
} else if (prompt.match(/--ar/)) { ratio = prompt?.split("--ar=")[1]?.split(" ")[0] || prompt?.split("--ar ")[1]?.split(" ")[0];
}
let count = prompt?.split("--count=")[1]?.split(" ")[0] || prompt?.split("--count ")[1]?.split(" ")[0] || 1;
let width = height = 1300;
let rWidth = parseInt(ratio.split(":")[0]);
let rHeight = parseInt(ratio.split(":")[1]);
if (rWidth > rHeight) { height = height * (rHeight / rWidth);
} else if (rHeight > rWidth) { width = width * (rWidth / rHeight);
}
const url = "https://api.distribute.ai/internal/consumer/conversation/generate";
const headers = {
  "accept": "*/*",
  "accept-language": "en-US,en;q=0.9",
  "authorization": "b46d34f21424d103a47b67f7f01fc1388a3c7f11278d1bfa1f0340df8343557c",
  "content-type": "application/json",
  "sec-ch-ua": "\"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
  "sec-ch-ua-mobile": "?1",
  "sec-ch-ua-platform": "\"Android\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "cookie": "cf_clearance=Xj4NIjHkInhv7Rfzkla6Q.wokruqv6jdVcExb4fA6FY-1747389659-1.2.1.1-pM36vGF_dy3GtxJdwWnrPZtSmDIUJKRS2XV6IAhGKr2LNwvjx8MfQEhze1Xn4XRnHyhSm_P5vqRUwe7QBzeMBKFEShu2jEPQoiRKRvlKhifKF0k4bTnlVVNvP1x4QuXMnzj1s1kC2XjrAbhB5IIJScORqh5G1ezmfbDg1fue7YiTQZ0k0hmnhGk5KpTN7UrMcu6VVGWs.EYjKCL5IR4EgZ6TkCSd1f9K9xSj4qSpPn93YhC0L9mnegI_AZYV.fes1lbFbLX4NCw1FV0NsFwGERIhb02a9icaLi8H64CFH12GqqQH92L5dfZgAQWXKV70zYVzrZaTSJ7d4WfFcsLq6JKH_Ck2BWi2DUNjHFNHzUU",
  "Referer": "https://dashboard.distribute.ai/",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};


message.reaction("⏳", event.messageID);
try {
let imgs = [];
for(i=0;i<count;i++) {
const data = {
  "model": "Flux.1 [dev]",
  "args": {
    "prompt": prompt,
    "seed": Math.floor(Math.random() * 999999),
    "width": Math.floor(width),
    "height": Math.floor(height),
    "guidanceScale": parseInt(prompt?.split("--scale=")[1]?.split(" ")[0] || prompt?.split("--scale ")[1]?.split(" ")[0] || 3),
    "numInferenceSteps": parseInt(prompt?.split("--steps=")[1]?.split(" ")[0] || prompt?.split("--steps ")[1]?.split(" ")[0] || 10),
  }
};
let res = await axios.post(url, data, { headers });
let finalUrl = extractUrl(res.data);
let output = await global.utils.getStreamFromURL(finalUrl, `flux_${i}.png`);
imgs.push(output);
}
message.reply({ body: "✅ | Here's your image",
attachment: imgs
});
} catch (e) { 
message.send(e.message);
		}
	}
}