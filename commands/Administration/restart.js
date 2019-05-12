/* eslint-disable no-unused-vars */
module.exports = {
	name: "restart",
	description: "Restart bot (bot owners only)",
	execute(message, args) {
		console.log(message.author.id);
		if (message.author.id == 312309974384640011) {
			message.channel.send("Shutting down bot. (restarting if using pm2)")
				.then(()=>{
					process.exit();
				});
		}
		else
			message.channel.send("You are not a bot owner!");
	},
};