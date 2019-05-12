/* eslint-disable no-unused-vars */
module.exports = {
	name: "botinfo",
	description: "Bot info",
	execute(message, args, Discord) {

		let totalSeconds = (message.client.uptime / 1000);
		let days = Math.floor(totalSeconds / 86400);
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = totalSeconds % 60;

		var onlineCount = message.client.users.filter(m => m.presence.status === "online").size;
		var textCount = message.client.channels.filter(m => m.type === "text").size;
		var vcCount = message.client.channels.filter(m => m.type === "voice").size;
		
		var embed = new Discord.MessageEmbed()
			.setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ format: "png", size: 512 }))
			.setTitle("Bot Info")
			.addField("Bot created on", message.client.user.createdAt.toDateString() + "\n "+ message.guild.createdAt.toLocaleTimeString("en-US"), true)
			.addField("Bot owner", "<@312309974384640011>", true)
			.addField("Uptime", `${days}d ${hours}h ${minutes}m ${Math.round(seconds)}s`, true)
			.addField("Servers", `**${message.client.guilds.size}**`, true)
			.addField("Users", `**${message.client.users.size}** (**${onlineCount}** Online)`, true)
			.addField("Channels", `**${textCount} ** Text, **${vcCount}** Voice`, true)
			.setColor(message.client.colormain)
			.setThumbnail(message.client.user.displayAvatarURL({ format: "png", size: 512 }))
			.setFooter("Server ID: "+message.guild.id);

		message.channel.send({embed: embed});
	},
};