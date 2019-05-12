/* eslint-disable no-unused-vars */
module.exports = {
	name: "leaderboard",
	description: "See the server's leaderboard!",
	guildOnly: true,
	aliases: ["lb", "board"],
	execute(message, args, Discord) {
		const top10 = message.client.sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);
		const embed = new Discord.MessageEmbed()
			.setColor(message.client.colormain)
			.setThumbnail(message.guild.iconURL)//https://i.imgur.com/0pytoWW.jpg
			.addField(`Leaderboards for **${message.guild.name}**`,"_Only showing top 10_",true)
			.setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ format: "png", size: 512 }));
		var plc = 1;
		for(const data of top10) {
			const curLevel = data.level;
			var neededXP = data.points;
		
			var done = false;
			while (done == false){
				neededXP++;
				var valLevel = Math.round(0.25 * Math.sqrt(neededXP));
				if (curLevel < valLevel){
					done = true;
				}
			}
			embed.addField("**"+plc+".** "+message.client.users.get(data.user).tag, `Level ${data.level}\n ${data.points}/${neededXP} EXP`);
			plc++;
		}
		return message.channel.send({embed});
	},
};