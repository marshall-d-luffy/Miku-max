const axios = require('axios');
const { getStreamFromURL } = global.utils;

module.exports = {

config: {

	name: "insta",
  
  author: "Tawsif~",

	category: "image",

	countDown: 10,

	role: 0,

	shortDescription: { en: "downloads Instagram reels"

},

	guide: { en: "url"

}

},

onStart: async function({ message, event, args }) {

const url = args.join(" ");

try {
  const response = await axios.post('https://sssinstagram.com/api/convert', 

  {

    url: `${url}`,

    ts: 1748769738053,

    _ts: 1747844691046,

    _tsc: 0,

    _s: "273a00f822c7f715450914583e15b22240fb1876dacffcd041ed70ef1d768c35"

  },

  {

    headers: {

      "accept": "application/json, text/plain, */*",

      "accept-language": "en-US,en;q=0.9",

      "content-type": "application/json",

      "save-data": "on",

      "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\"",

      "sec-ch-ua-mobile": "?1",

      "sec-ch-ua-platform": "\"Android\"",

      "sec-fetch-dest": "empty",

      "sec-fetch-mode": "cors",

      "sec-fetch-site": "same-origin",

      "cookie": "uid=b9fd686062e43f74; adsUnderSearchInput=35; _ga=GA1.1.615883995.1748769715; __gads=ID=77ac26857fb600cf:T=1748769717:RT=1748769717:S=ALNI_Mah7-xYbhjz8ADIMFbPxdpfkC8H0w; __gpi=UID=0000110b57c0784f:T=1748769717:RT=1748769717:S=ALNI_Mb7H_EXpYP8R0IRv4FC3mstf3WGUQ; __eoi=ID=afbf8b249f613352:T=1748769717:RT=1748769717:S=AA-AfjYVyoWrMlpV3YukGynoemL9; _ga_KDHKH4GDQE=GS2.1.s1748769715$o1$g1$t1748769738$j37$l0$h0"

    },

    referrerPolicy: "no-referrer"

  });
  message.reply({ attachment: await getStreamFromURL(response.data.url[0].url)});

} catch (error) {

  message.reply(error.message);
}
	}

}