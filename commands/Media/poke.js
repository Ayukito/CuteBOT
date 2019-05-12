/* eslint-disable no-unused-vars */
const client = require("nekos.life");
const {sfw} = new client();
module.exports = {
	name: "poke",
	description: "Poke the girl!",
	args: true,
	usage: "<@user>",
	async execute(message, args, Discord) {
		if (!message.mentions.users.size) {
			return message.reply("you need to tag a user in order to poke them!");
		}
		const taggedUser = message.mentions.users.first();
		const img = await sfw.poke().then(Results => {
			//console.log(Post.media[0].gif);
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor(message.client.colormain)
				.setTitle("le poke")
				.setDescription(`${message.author} has poked ${taggedUser}`)
				.setImage(Results.url);

			return message.channel.send(exampleEmbed);
		}).catch(console.error);
	},
};