const axios = require('axios');
module.exports = {
config: {
name: "bs",
author: "Tawsif~",
role: 0
},
onStart: async function() {},
onChat: async function({ event, message }) {
const b = event.body;
if (b === "🐧" || b === "🐦" || b === "ok") {
await axios.get("https://tawsifz-gemini.onrender.com/edit");
await axios.get("https://tawsifz-fakechat.onrender.com/image");
await axios.get("https://seaart.onrender.com/gen");
}
}
}