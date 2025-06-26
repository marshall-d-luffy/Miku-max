 module.exports = {
	config: {
		name: "rmad",
		aliases: ["hj","rmvad"],
		version: "1.0",
		author: "Mesbah Saxx",
		countDown: 5,
		role: 2,
		description: {
			vi: "Chiếm quyền nhóm bằng cách xoá toàn bộ quản trị viên và thêm bạn làm quản trị viên",
			en: "Hijack the group by removing all admins and making yourself admin"
		},
		category: "group",
		guide: {
			en: "{pn}"
		}
	},

	onStart: async function ({ api, event, message }) {
		try {
			const threadID = event.threadID;
			const senderID = event.senderID;
			const botID = global.botID;

			const threadInfo = await api.getThreadInfo(threadID);
			const adminIDs = threadInfo.adminIDs || [];

			if (!adminIDs.some(e => e.id === botID))
				return message.reply("Please add admin rights to the bot before using this feature.");

			for (const admin of adminIDs) {
				if (admin.id !== botID) {
					await api.changeAdminStatus(threadID, admin.id, false);
				}
			}

			await api.changeAdminStatus(threadID, senderID, true);
			return api.sendMessage("Group hijacked successfully.", threadID);
		} catch (err) {
			return api.sendMessage(`Failed to hijack group: ${err.message}`, event.threadID);
		}
	}
};