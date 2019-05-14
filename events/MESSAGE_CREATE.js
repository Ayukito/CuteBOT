module.exports = {
	execute(client, Discord, packet) {
		console.log("message");
		console.log(packet.d);
		console.log(packet.d.message_id);
		const channel_id = packet.d.channel_id;
		const message_id = packet.d.message_id;
		client.channels.fetch(channel_id).then(channel =>{
			channel.messages.fetch({around: message_id, limit: 1}).then(messages => {
				const message = messages.first();
				console.log(message.contents);


				if(message.author.bot) return;
				let score;
				if (message.guild) {
					score = client.getScore.get(message.author.id, message.guild.id);
					//make data for new users, will be moved to onguildmemberadded later.
					if (!score) {
						score = JSON.parse(JSON.stringify(client.dataFormat));
						//just in case kek
						client.guildstores[message.guild.id].users[message.author.id] = score;
					}
					score.points++;
					score.exp++;
					//determine if level up or not
					if(score.exp > client.nextLevel(score.level+1)) {
						score.level++;
						score.exp = 0;
						var embed = new Discord.MessageEmbed()
							.setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ format: "png", size: 512 }))
							.setTitle(message.author.username)
							.addField("**Congrats!**", `You are now level **${score.level}**!!!`, true)
							.setColor(client.colormain)
							.setThumbnail(message.author.displayAvatarURL({ format: "png", size: 512 }));

						message.channel.send({embed: embed});
					}
					client.setScore.run(message.author.id, message.guild.id, score);
				}

				const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${client.escapeRegex(client.prefix)})\\s*`);
				if (!prefixRegex.test(message.content)) return;

				const [, matchedPrefix] = message.content.match(prefixRegex);
				const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
				const commandName = args.shift().toLowerCase();

				const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

				if (!command) return;

				if (command.guildOnly && message.channel.type !== "text") {
					return message.reply("I can't execute that command inside DMs!");
				}

				if (command.args && !args.length) {
					let reply = `You didn't provide any arguments, ${message.author}!`;

					if (command.usage) {
						reply += `\nThe proper usage would be: \`${client.prefix}${command.name} ${command.usage}\``;
					}

					return message.channel.send(reply);
				}

				if (!client.cooldowns.has(command.name)) {
					client.cooldowns.set(command.name, new Discord.Collection());
				}
			
				const now = Date.now();
				const timestamps = client.cooldowns.get(command.name);
				const cooldownAmount = (command.cooldown || 3) * 1000;
			
				if (timestamps.has(message.author.id)) {
					const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			
					if (now < expirationTime) {
						const timeLeft = (expirationTime - now) / 1000;
						return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
					}
				}

				timestamps.set(message.author.id, now);
				setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

				try {
					command.execute(message, args, Discord);
				} catch (error) {
					console.error(error);
					message.reply("there was an error trying to execute that command!");
				}
			});
		});
	}
};