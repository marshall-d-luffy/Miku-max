const axios = require('axios');
const parser = (response) => {
let result = '';
for (const line of response.split('\n')) {
  if (!line.startsWith('data:')) continue;
    const data = JSON.parse(line.slice(5).trim());
    const content = data.choices?.[0]?.delta?.content;
    if (content) result += content;
}
return result;
};
module.exports = {
config: {
	name: "ai",
	author: "Tawsif~",
	category: "image",
	countDown: 5,
	role: 0,
	shortDescription: "chat with llama",
	guide: "ai  <texts>"
},
onStart: async function({ message, event, args }) {
const prompt = args.join(" ") || "hi";
const url = "https://api.distribute.ai/internal/consumer/conversation/chat";
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
  "cookie": "cf_clearance=Tx7LMGs0STPACkNXz3dMccpLg1gaIqnhKq_qjRkUM8o-1747551920-1.2.1.1-SMrXm78EqCWlMrXa.aqOHYeFzX07E1zUO9tgdaz_Ua70aiebebSMQqI9T68CxZj6ekSZDh7ZiEgc_Pt5qQn7h52NQlc5fnoUal0943cUxYs47lvBClKrCAicHyv3dWahqLdauM1TusJbWWWXA0Tl9UKRdq5oHAYy444l9IBVUYANeRVU5IAwTffLUR7BA4JKPeY5UpwiSuKhIUEs.g_jNRm29MhALs.IjSQ1gN_B3ccIY7_CeGAUuxe8GTPqxgU2019zfY6rpOLNi1oV2ogr7bfGhaKwexub7s1HfUnTymLwfLO2Ye.jcF5cQDx0c1g_y4xS6kgRpn9eN8hztM9uIbCZbolxIlpzShDoNTFQQgE",
  "Referer": "https://dashboard.distribute.ai/",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

const data = {
  "model": "Llama-3.1 8B",
  "args": {
    "input": [
      {"role": "user", "content": prompt}
    ],
    "temperature": 0.01,
    "maxNewTokens": 256,
    "topP": 0,
    "topK": 0,
    "seed": 598206
  },
  "conversationId": "d81f969d-b6aa-47ce-9177-6292b6b02fcd"
};
try {
const res = await axios.post(url, data, { headers });
const output = await parser(res.data);
message.reply(output);
} catch (e) {
message.send("An error occured");
}
}
}