/* eslint-disable no-unused-vars */
module.exports = {
	name: "profile",
	description: "See your profile!",
	guildOnly: true,
	aliases: ["level"],
	usage: "(OPTIONAL) <@user>",
	execute(message, args, Discord) {
		const user = message.mentions.users.first() || message.author;
		let score = message.client.getScore(user.id, message.guild.id);
		const curLevel = score.level;
		
		var embed = new Discord.MessageEmbed()
			.setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ format: "png", size: 512 }))
			.setTitle(user.username+"'s Profile")
			.setDescription(`**Level:** ${curLevel} \n**Exp:** ${score.exp}/${message.client.nextLevel(score.level+1)} \n**Money:** ${score.money}`) /// ${iUser.nextPL}
			.setColor(message.client.colormain)
			.setThumbnail(user.displayAvatarURL({ format: "png", size: 512 }));

		message.channel.send({embed: embed});
		//return message.reply(`You currently have ${score.points} points and are level ${score.level}!`);
	},
};