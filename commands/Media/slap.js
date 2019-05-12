/* eslint-disable no-unused-vars */
const client = require("nekos.life");
const {sfw} = new client();
module.exports = {
	name: "slap",
	description: "Slap the girl!",
	args: true,
	usage: "<@user>",
	async execute(message, args, Discord) {
		if (!message.mentions.users.size) {
			return message.reply("you need to tag a user in order to slap them!");
		}
		const taggedUser = message.mentions.users.first();
		const img = await sfw.slap().then(Results => {
			//console.log(Post.media[0].gif);
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor(message.client.colormain)
				.setTitle("le slap")
				.setDescription(`${message.author} has slapped ${taggedUser}`)
				.setImage(Results.url);

			return message.channel.send(exampleEmbed);
		}).catch(console.error);
	},
};