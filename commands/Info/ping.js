/* eslint-disable no-unused-vars */
const emojiCharacters = require("../../emojis.js");

module.exports = {
	name: "ping",
	description: "Ping!",
	execute(message, args) {
		message.channel.send("Pinging...").then(sent => {
			sent.edit(`${emojiCharacters.p} ${emojiCharacters.o} ${emojiCharacters.n} ${emojiCharacters.g}${emojiCharacters["!"]}Took ${sent.createdTimestamp - message.createdTimestamp}ms`);
		});
	},
};