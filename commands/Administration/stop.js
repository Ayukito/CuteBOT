/* eslint-disable no-unused-vars */
module.exports = {
	name: "stop",
	aliases: ["restart", "save"],
	description: "Stop bot (bot owners only, restarts sometimes lol)",
	execute(message, args, Discord) {
		if (message.author.id == 312309974384640011) {
			message.client.save();
			message.channel.send("Shutting down bot. (restarts sometimes lol)")
				.then(()=>{
					process.exit();
				});
		}
		else
			message.channel.send("You are not a bot owner!");
	},
};