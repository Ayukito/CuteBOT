/* eslint-disable no-unused-vars */
module.exports = {
	name: "kick",
	description: "Kick user",
	guildOnly: true,
	aliases: ["boot"],
	usage: "<@user>",
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply("you need to tag a user in order to kick them!");
		}

		if (message.guild.member(message.author).hasPermission("KICK_MEMBERS")) {
			const taggedUser = message.mentions.users.first();
      
      
			message.guild.member(taggedUser).kick()
				.then((thing)=>{
					message.channel.send(`You kicked ${taggedUser.username}!`);
				})
				.catch((err)=>{
					message.channel.send(`You can't kick ${taggedUser.username}!`);
				});
		}else{
			message.channel.send("You do not have permission to kick users!");
		}
	},
};