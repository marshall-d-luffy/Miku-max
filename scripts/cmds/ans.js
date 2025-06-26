 module.exports = {
  config: {
    name: "ans",
    version: "1.0",
    author: "Tawsif~",
    countDown: 5,
    role: 0,
    shortDescription: "",
    longDescription: "shows guessnumber game answer",
    category: "game",
  },
  onStart: async function({ event, message }) {
try {
    const ans = global.GoatBot.onReply.get(event.messageReply.messageID).gameData.answer;
message.reply(`${ans}`);
} catch (error) { 
message.send(`${error.message}`)};
	}
}