const { utils } = global;

module.exports = {
  config: {
    name: "boxoff",
    version: "1.0",
    author: "S M Fahim",
    countDown: 5,
    role: 2,
    shortDescription: "Reset onlyAdminBox for this thread",
    longDescription: "Set data.onlyAdminBox to false for this thread",
    category: "admin",
    guide: {
      en: "${p}{n}boxoff",
    },
  },

  onStart: async function ({ message, event, threadsData }) {
    const threadID = event.threadID;
    try {
      await threadsData.set(threadID, false, "data.onlyAdminBox");
      return message.reply(`✅ Thread ${threadID} value 'data.onlyAdminBox' set to false`);
    } catch (err) {
      return message.reply(`❌ Failed to update onlyAdminBox: ${err.message}`);
    }
  },

  onChat: async function ({ event, message, threadsData }) {
    if (event.body && event.body.toLowerCase() === "box off") {
      const threadID = event.threadID;
      try {
        await threadsData.set(threadID, false, "data.onlyAdminBox");
        return message.reply(`✅ Thread ${threadID} value 'data.onlyAdminBox' set to false`);
      } catch (err) {
        return message.reply(`❌ Failed to update onlyAdminBox: ${err.message}`);
      }
    }
  }
};