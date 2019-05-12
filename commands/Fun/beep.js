/* eslint-disable no-unused-vars */
module.exports = {
	name: "beep",
	description: "Beep!",
	execute(message, args, Discord) {
		message.channel.send("Boop.");
	},
};