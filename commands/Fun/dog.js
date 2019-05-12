/* eslint-disable no-unused-vars */
module.exports = {
	name: "dog",
	description: "DOGS?!",
	async execute(message, args, Discord) {
		const superagent = require("superagent");
		const { body } = await superagent
			.get("https://dog.ceo/api/breeds/image/random");
		const exampleEmbed = new Discord.MessageEmbed()
			.setColor(message.client.colormain)
			.setTitle("Dogs!")
			.setImage(body.message);

		return message.channel.send(exampleEmbed);
	}
};