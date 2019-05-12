/* eslint-disable no-unused-vars */
const client = require("nekos.life");
const {sfw} = new client();

module.exports = {
	name: "neko",
	description: "NEKOS",
	async execute(message, args, Discord) {
		const img = await sfw.neko();
		const exampleEmbed = new Discord.MessageEmbed()
			.setColor(message.client.colormain)
			.setTitle("Neko")
			.setImage(img.url);

		return message.channel.send(exampleEmbed);
	},
};