/* eslint-disable no-unused-vars */
module.exports = {
	name: "serverinfo",
	description: "Server info",
	guildOnly: true,
	execute(message, args, Discord) {

		var onlineCount = message.guild.members.filter(m => m.presence.status === "online").size;
		var textCount = message.guild.channels.filter(m => m.type === "text").size;
		var vcCount = message.guild.channels.filter(m => m.type === "voice").size;
		var embed = new Discord.MessageEmbed()
			.setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ format: "png", size: 512 }))
			.setTitle(message.guild.name)
			.addField("Server created on", message.guild.createdAt.toDateString() + "\n "+ message.guild.createdAt.toLocaleTimeString("en-US"), true)
			.addField("Server owner", message.guild.owner, true)
			.addField("Members", `**${message.guild.memberCount}** (**${onlineCount}** Online)`, true)
			.addField("Channels", `**${textCount} ** Text, **${vcCount}** Voice`, true)
			.addField("Roles", `**${message.guild.roles.size-2}**`, true)
			.addField("Emojis", `**${message.guild.emojis.size}**`, true)
			.setColor(message.client.colormain)
			.setThumbnail(message.guild.iconURL({ format: "png", size: 512 }))
			.setFooter("Server ID: "+message.guild.id);

		message.channel.send({embed: embed});
	},
};