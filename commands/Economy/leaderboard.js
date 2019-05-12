/* eslint-disable no-unused-vars */
module.exports = {
	name: "leaderboard",
	description: "See the server's leaderboard!",
	guildOnly: true,
	aliases: ["lb", "board"],
	execute(message, args, Discord) {
		var clonedArray = JSON.parse(JSON.stringify(message.client.guildstores[message.guild.id].users));

		var sortable = [];
		for (var usr in clonedArray) {
			sortable.push([usr, clonedArray[usr]]);
		}

		sortable.sort(function(a, b) {
			return b[1].points - a[1].points;
		});

		sortable = sortable.slice(0,10);
		//const top10 = message.client.sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);
		const top10 = clonedArray;
		const embed = new Discord.MessageEmbed()
			.setColor(message.client.colormain)
			.setThumbnail(message.guild.iconURL)//https://i.imgur.com/0pytoWW.jpg
			.addField(`Leaderboards for **${message.guild.name}**`,"_Only showing top 10_",true)
			.setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ format: "png", size: 512 }));
		var plc = 1;
		sortable.forEach(element => {
			var data = element[1];
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
			embed.addField("**"+plc+".** "+message.client.users.get(element[0]).tag, `Level ${data.level}\n ${data.points}/${neededXP} EXP`);
			plc++;
		});
		return message.channel.send({embed});
	},
};