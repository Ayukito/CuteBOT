/* eslint-disable no-unused-vars */
module.exports = {
	name: "prune",
	description: "Prune shit",
	guildOnly: true,
	args: true,
	aliases: ["purge"],
	usage: "<INT>", 
	execute(message, args) {
		if (message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) {
			const amount = parseInt(args[0]) + 1;
			
			if (isNaN(amount)) {
				return message.reply("that doesn't seem to be a valid number.");
			}
	
			if (isNaN(amount)) {
				return message.reply("that doesn't seem to be a valid number.");
			} else if (amount < 1 || amount > 1000) {
				return message.reply("you need to input a number between 1 and 999.");
			}
		
			message.channel.bulkDelete(amount, true).catch(err => {
				console.error(err);
				message.channel.send("there was an error trying to prune messages in this channel!");
			});
		}else{
			message.channel.send("You do not have permission to prune messages! (Need permission MANAGE_MESSAGES)");
		}
	},
};