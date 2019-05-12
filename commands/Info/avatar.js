/* eslint-disable no-unused-vars */
module.exports = {
	name: "avatar",
	description: "get avatars kek",
	guildOnly: true,
	aliases: ["icon", "pfp"],
	usage: "(OPTIONAL) <@user>",
	execute(message, args, Discord) {
		if (!message.mentions.users.size) {
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor(message.client.colormain)
				.setTitle(`${message.author.username}'s avatar:`)
				.setImage(message.author.displayAvatarURL({ format: "png", size: 512 }));
				
			return message.channel.send(exampleEmbed);
		}
  
		const avatarList = message.mentions.users.map(user => {
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor(message.client.colormain)
				.setTitle(`${user.username}'s avatar:`)
				.setImage(user.displayAvatarURL({ format: "png", size: 512 }));
      
			return message.channel.send(exampleEmbed);
		});
	},
};