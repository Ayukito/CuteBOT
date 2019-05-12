/* eslint-disable no-unused-vars */
module.exports = {
	name: "stop",
	aliases: ["restart"],
	description: "Stop bot (bot owners only, restarts sometimes lol)",
	execute(message, args) {
		console.log(message.author.id);
		if (message.author.id == 312309974384640011) {
			message.channel.send("Shutting down bot. (restarts sometimes lol)")
				.then(()=>{
					process.exit();
				});
		}
		else
			message.channel.send("You are not a bot owner!");
	},
};