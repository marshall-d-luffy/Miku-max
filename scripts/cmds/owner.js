module.exports = {
  config: {
    name: "owner",
    version: "1.0",
    author: "Tawsif~",
    countDown: 5,
    role: 0,
    shortDescription: "",
    longDescription: "know owner info",
    category: "box chat",
  },
  onStart: async function({ event, message, usersData }) {
const name = await usersData.getName(event.senderID);
message.reply(` hello ${name} 😊,
looking for my owner?
My owner is Tawsif
contact: facebook.com/tawsif.uwu`);
	}
}