/* eslint-disable no-unused-vars */
const client = require("nekos.life");
const {sfw} = new client();
module.exports = {
	name: "headpat",
	description: "Headpat your neko",
	args: true,
	aliases: ["pat"],
	usage: "<@user>",
	async execute(message, args, Discord) {
		if (!message.mentions.users.size) {
			return message.reply("you need to tag a user in order to headpat them!");
		}
		const taggedUser = message.mentions.users.first();
		const img = await sfw.pat().then(Results => {
			//console.log(Post.media[0].gif);
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor(message.client.colormain)
				.setTitle("le headpat")
				.setDescription(`${message.author} has give ${taggedUser} headpats!`)
				.setImage(Results.url);

			return message.channel.send(exampleEmbed);
		}).catch(console.error);
	},
};