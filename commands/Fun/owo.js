/* eslint-disable no-unused-vars */
const client = require("nekos.life");
const {sfw} = new client();
module.exports = {
	name: "owo",
	description: "OwOify text",
	guildOnly: true,
	args: true,
	aliases: ["owoify"],
	usage: "<TEXT>",
	async execute(message, args, Discord) {
		const arg = args.join(" ");
		const txt = await sfw.OwOify({text: arg}).then(Result =>{
			message.delete().catch();
			message.channel.send(Result.owo, {disableEveryone:true});
		});
	},
};