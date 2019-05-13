const responses = ["It is certain", "It is decidedly so", "Without a doubt", "Yes – definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Signs point to yes", "Reply hazy", "try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Dont count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];

/* eslint-disable no-unused-vars */
module.exports = {
	name: "8ball",
	description: "Ask the magic 8ball something!",
	args: true,
	aliases: ["8b"],
	usage: "<QUESTION>",
	execute(message, args, Discord) {
		const mes = args.join(" ");
		if (mes.indexOf("?")>=0){
			var rand = Math.floor(Math.random() * responses.length);

			const resp = responses[rand];
			const embed = new Discord.MessageEmbed()
				.setColor(message.client.colormain)
				.setTitle("The Magic 8Ball")
				.setDescription("<@"+message.author.id+">**:**\n"+mes+"\n**8Ball:**\n"+resp)
				.setThumbnail("http://www.pngmart.com/files/3/8-Ball-Pool-Transparent-PNG.png")
				.setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ format: "png", size: 512 }));
			if(!message.channel.type == "dm"){
				message.delete().catch();
			}
			message.channel.send({embed});
		}else{
			message.channel.send("That's not a question! Ask again.");
		}
		
	},
};