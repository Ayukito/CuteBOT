/* eslint-disable no-unused-vars */
module.exports = {
	name: "say",
	description: "say it back",
	guildOnly: true,
	args: true,
	aliases: ["repeat"],
	usage: "<TEXT>",
	execute(message, args, Discord) {
		const arg = args.join(" ");
		message.delete().catch();
		message.channel.send(arg, {disableEveryone:true});
	},
};