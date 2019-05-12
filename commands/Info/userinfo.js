/* eslint-disable no-unused-vars */
module.exports = {
	name: "userinfo",
	description: "User info",
	guildOnly: true,
	execute(message, args, Discord) {
		const user = message.mentions.users.first() || message.author;
		const guildmember = message.guild.member(user);
		
		var embed = new Discord.MessageEmbed()
			.setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ format: "png", size: 512 }))
			.setTitle(`${user.tag} || ID: ${user.id}`)
			.setDescription("Chilling while "+ user.presence.status)
			.addField("Joined Discord on", user.createdAt.toDateString() + "\n "+ user.createdAt.toLocaleTimeString("en-US"), true)
			.addField("Joined Server on", guildmember.joinedAt.toDateString() + "\n "+ guildmember.joinedAt.toLocaleTimeString("en-US"), true)
			.addField("Roles", guildmember.roles.map(r => `${r}`).join(" | "), true)
			.setColor(message.client.colormain)
			.setThumbnail(user.displayAvatarURL({ format: "png", size: 512 }))
			.setFooter("Server ID: "+message.guild.id);

		message.channel.send({embed: embed});
	},
};