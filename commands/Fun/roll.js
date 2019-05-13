//http://gsanteco.is2.byuh.edu/cis101.2145/dice/
/* eslint-disable no-unused-vars */
module.exports = {
	name: "roll",
	description: "Roll a 6 sided die",
	aliases: ["dice", "die"],
	execute(message, args, Discord) {
		var rand = Math.floor(Math.random() * 6)+1;

		const embed = new Discord.MessageEmbed()
			.setColor(message.client.colormain)
			.setTitle("Dice Roll")
			.setDescription("<@"+message.author.id+"> has rolled a "+rand+"!")
			.setThumbnail("https://github.com/Ayukito/Ayukito.github.io/blob/master/"+rand+".png?raw=true")
			.setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ format: "png", size: 512 }));
		if(!message.channel.type == "dm"){
			message.delete().catch();
		}
		message.channel.send({embed});
	},
};