const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "stream",
    author: "Tawsif~",
    role: 0,
    countDown: 5,
	category: "media", shortDescription: {
      en: "streams images and videos from given URL"
    },
    guide: {
      en: "{pn} <url> <format (png, jpg, mp4, gif)> | <reply>"
    }
  },
  onStart: async function({ event, args, message }) {
    let url = args[0];
    let type;
      if (event?.messageReply?.body) {
        url = event.messageReply.body;
        type = args[0] || 'stream.png';
      } else if (event?.messageReply?.attachments[0]?.url) {
url = event.messageReply.attachments[0].url;
type = args[0] || 'stream.png';
} else if (args[0]) {
      url = args[0];
      type = args[1] || 'stream.png';
    } else {
        return message.reply("provide or reply to a valid URL");
      }
    try {
      const fileExtension = type.split(".")[1] || type.split(".")[0];
      const format = fileExtension.toUpperCase(); // Correctly use toUpperCase()

      message.reply({
        attachment: await getStreamFromURL(url, `${type}`),
        body: `✅ | Media Streamed\nFormat: ${format}`
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      return message.reply("❌ | invalid URL or format"+ error.message);
    }
  }
};