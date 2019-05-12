const randomPuppy = require("random-puppy");
let reddit = [
	"meme",
	"animemes",
	"MemesOfAnime",
	"animememes",
	"AnimeFunny",
	"dankmemes",
	"dankmeme",
	"wholesomememes",
	"MemeEconomy",
	"techsupportanimals",
	"meirl",
	"me_irl",
	"2meirl4meirl",
	"AdviceAnimals"
];

/* eslint-disable no-unused-vars */
module.exports = {
	name: "meme",
	description: "Memesirl",
	async execute(message, args, Discord) {
		let subreddit = reddit[Math.floor(Math.random() * reddit.length)];
		randomPuppy(subreddit).then(async url => {
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor(message.client.colormain)
				.setTitle(subreddit)
				.setImage(url);

			return message.channel.send(exampleEmbed);
		}).catch(err => console.error(err));
	}
};