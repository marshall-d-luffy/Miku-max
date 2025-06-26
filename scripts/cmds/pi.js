const axios = require('axios');

async function callPi(q, s, v = false, m = 4) {
  const { data: { public: base } } = await axios.get("https://raw.githubusercontent.com/Tanvir0999/stuffs/refs/heads/main/raw/addresses.json");
  const { data } = await axios.get(`${base}/pi?query=${encodeURIComponent(q)}&session=${encodeURIComponent(s)}&voice=${v}&model=${m}`);
  return data;
}

module.exports = {
  config: {
    name: "pi",
    version: "1.1",
    role: 0,
    author: "tanvir",
    shortDescription: { en: "Talk to Pi assistant" },
    longDescription: { en: "Chat with the Pi assistant. An assistant with feelings and can talk" },
    category: "ai",
    guide: { en: "{pn} prompt\n\n{pn} voice on/off\n\n{pn} set model (1-8)\n\n{pn} clear" },
  },
  
  onStart: async ({ args, message, event, usersData }) => {
    if (!args[0]) return message.SyntaxError();
    const s = event.senderID;
    const ud = (await usersData.get(s)) || { data: {} };
    const pi = ud.data.pi || {};
    
    if (args[0].toLowerCase() === 'voice') {
      if (!args[1])
        return message.reply("Please specify 'on' or 'off' for voice mode.");
      const mode = args[1].toLowerCase();
      if (mode === 'on') {
        pi.voice = true;
      } else if (mode === 'off') {
        pi.voice = false;
      } else {
        return message.reply("Invalid option. Use 'on' or 'off' for voice mode.");
      }
      ud.data.pi = pi;
      await usersData.set(s, ud);
      return message.reply(`Voice mode ${mode === 'on' ? 'enabled' : 'disabled'}.`);
    }
    
    if (args[0].toLowerCase() === 'set') {
      if (!pi.voice)
        return message.reply("Turn on voice mode to set a voice model.");
      const m = parseInt(args[1], 10);
      if (!m || m < 1 || m > 8)
        return message.reply("Invalid voice model. Choose a model between 1 to 8.");
      pi.model = m;
      ud.data.pi = pi;
      await usersData.set(s, ud);
      return message.reply(`Voice model set to ${m}.`);
    }
    
    const q = args.join(" ");
    const v = pi.voice || false;
    const m = pi.model || 4;
    
    try {
      message.reaction("🐸", event.messageID);
      const res = await callPi(q, s, v, m);
      if (!res.success) throw new Error("Pi API returned error");
      const txt = res.data.text;
      
      if (res.data.audio) {
        const stream = await global.utils.getStreamFromURL(res.data.audio);
        const rep = await message.reply({ body: txt, attachment: stream });
        GoatBot.onReply.set(rep.messageID, { commandName: "pi", author: s, messageID: rep.messageID });
      } else {
        const rep = await message.reply(txt);
        GoatBot.onReply.set(rep.messageID, { commandName: "pi", author: s, messageID: rep.messageID });
      }
    } catch (e) {
      console.error(e);
      message.reaction("🖕🏻", event.messageID);
      return message.reply("🖕🏻 | Err, Try again.");
    }
  },
  
  onReply: async ({ event, message, args, Reply, usersData }) => {
    if (Reply.author !== event.senderID) return;
    if (!args[0]) return message.SyntaxError();
    try {
      const s = event.senderID;
      const ud = (await usersData.get(s)) || { data: {} };
      const pi = ud.data.pi || {};
      
      const q = args.join(" ");
      const v = pi.voice || false;
      const m = pi.model || 4;
      message.reaction("🐸", event.messageID);
      const res = await callPi(q, s, v, m);
      if (!res.success) throw new Error("Pi API returned error");
      const txt = res.data.text;
      
      if (res.data.audio) {
        const stream = await global.utils.getStreamFromURL(res.data.audio);
        GoatBot.onReply.delete(Reply.messageID);
        const rep = await message.reply({ body: txt, attachment: stream });
        GoatBot.onReply.set(rep.messageID, { commandName: "pi", author: s, messageID: rep.messageID });
      } else {
        GoatBot.onReply.delete(Reply.messageID);
        const rep = await message.reply(txt);
        GoatBot.onReply.set(rep.messageID, { commandName: "pi", author: s, messageID: rep.messageID });
      }
    } catch (e) {
      console.error(e);
      message.reaction("🖕🏻", event.messageID);
      return message.reply("🖕🏻 | Err, Try again.");
    }
  },
};