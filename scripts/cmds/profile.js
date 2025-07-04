module.exports = {
	config: {
		name: "profile",
aliases: ["pfp"],

		version: "1.1",
		author: "NIB & Tawsif~",
		countDown: 5,
		role: 0,
		shortDescription: "PROFILE image",
		longDescription: "PROFILE image",
		category: "image",
		guide: {
			en: "   {pn} @tag"
		}
	},

	langs: {
		vi: {
			noTag: "Bạn phải tag người bạn muốn tát"
		},
		en: {
			noTag: "You must tag the person you want to get profile picture of"
		}
	},

	onStart: async function ({ event, message, usersData, api, args, getLang }) {
    let avt;
		const uid1 = event.senderID;
		const uid2 = Object.keys(event.mentions)[0];
		if(event.type == "message_reply"){
      avt = await usersData.getAvatarUrl(event.messageReply.senderID)
    } else if (args[0]) {
avt = await usersData.getAvatarUrl((await api.getUID(args[0])));
} else {
      if (!uid2){avt =  await usersData.getAvatarUrl(uid1)
              } else{avt = await usersData.getAvatarUrl(uid2)}}


		message.reply({	attachment: await global.utils.getStreamFromURL(avt)
	})
  }
};