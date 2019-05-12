/* eslint-disable no-unused-vars */
module.exports = {
	name: "gif",
	description: "Random gif of choice!",
	aliases: ["teneor"],
	args: true,
	usage: "<gif name>",
	execute(message, args, Discord) {
		message.client.Tenor.Search.Random(args.join(" "), "1").then(Results => {
			Results.forEach(Post => {
				//console.log(Post.media[0].gif);
				const exampleEmbed = new Discord.MessageEmbed()
					.setColor(message.client.colormain)
					.setTitle(`${args.join(" ")} query:`)
					.setImage(Post.media[0].gif.url);

				return message.channel.send(exampleEmbed);
			});
		}).catch(console.error);
	},
};