
module.exports = {
	config: {
		name: "leave",
		aliases: [],
		version: "1.0",
		author: "Sandy & fixed by Tawsif~",
		countDown: 5,
		role: 2,
		shortDescription: "bot will leave gc",
		longDescription: "",
		category: "admin",
		guide: {
			vi: "{pn} [tid,blank]",
			en: "{pn} [tid,blank]"
		}
	},

	onStart: async function ({ api,event,args, message }) {
 var id;
 if (!args.join(" ")) {
 id = event.threadID;
 } else {
 id = args[0];
 }
 return api.sendMessage('goodbye guys', id, () => api.removeUserFromGroup(api.getCurrentUserID(), id))
		}
	};