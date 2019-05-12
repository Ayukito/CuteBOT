/* eslint-disable no-lonely-if */
module.exports = {
	name: "help",
	description: "List all of my commands or info about a specific command.",
	aliases: ["commands"],
	usage: "(OPTIONAL) <command name>",
	category: "Info",
	cooldown: 5,
	execute(message, args, Discord) {
		const { prefix } = require("../../config.json");
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			var embed = new Discord.MessageEmbed()
				.setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ format: "png", size: 512 }))
				.setTitle("List of commands")
				.setColor(message.client.colormain);

			data.push("Here's a list of all my commands:");

			const commandsort = {};

			// eslint-disable-next-line no-unused-vars
			for (const [key, com] of commands.entries()) {
				if (!commandsort[com.category]) {
					commandsort[com.category] = [];
					commandsort[com.category].push(com);
				} else {
					commandsort[com.category].push(com);
				}
          
			}

			// eslint-disable-next-line no-inner-declarations
			function sortObject(o) {
				var sorted = {},
					key, a = [];
    
				for (key in o) {
					if (o.hasOwnProperty(key)) {
						a.push(key);
					}
				}
    
				a.sort();
    
				for (key = 0; key < a.length; key++) {
					sorted[a[key]] = o[a[key]];
				}
				return sorted;
			}

			const tt = sortObject(commandsort);

			for (const x in tt){
				var st = "";
				for (var i = 0; i < tt[x].length; i++){
					st = st+tt[x][i].name+", ";
				}
				st = st.substring(0,st.length-2);
				embed.addField(x,st,false);
				//data.push("**"+x+":** "+st);
        
			}
			embed.setDescription(`You can send \`${prefix}help [command name]\` to get info on a specific command!`);
			//data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
        
			//return message.author.send(data, { split: true })
			return message.author.send({embed: embed})
				.then(() => {
					if (message.channel.type === "dm") return;
					message.reply("I've sent you a DM with all my commands!");
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply("it seems like I can't DM you! Do you have DMs disabled?");
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply("that's not a valid command!");
		}
		var embed2 = new Discord.MessageEmbed()
			.setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ format: "png", size: 512 }))
			.setTitle(`**${command.name}**`)
			.addField("Aliases:", command.aliases && command.aliases.join(", ") || "None", false)
			.addField("Description:", command.description || "None", false)
			.addField("Usage:", prefix+command.name+(command.usage && " "+command.usage || ""), false)
			.addField("Cooldown:", command.cooldown || 3 + " second(s)", false)
			.setColor(message.client.colormain);
		message.channel.send({embed: embed2});
	},
};