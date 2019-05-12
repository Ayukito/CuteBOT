/* eslint-disable no-redeclare */
/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-vars */
const client = require("nekos.life");
const {nsfw} = new client();

module.exports = {
	name: "hentai",
	description: "#NSFW\nTags: pussy, neko, solo, lesbian, cumsluts, boobs, avatar",
	aliases: ["nsfw"],
	usage: "(OPTIONAL) <tag>",
	async execute(message, args, Discord) {
		// eslint-disable-next-line valid-typeof
		if (message.channel.type == "text" && message.channel.nsfw == false) return message.channel.send("Can't send in a non-NSFW channel.");
		if (!args.length) {
			const pick = Math.floor(Math.random() * 2);
			var img;
			if (pick == 0){
				img = await nsfw.randomHentaiGif();
			}else
				img = await nsfw.hentai();
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor(message.client.colormain)
				.setTitle("Hentai")
				.setImage(img.url);

			return message.channel.send(exampleEmbed);
		}else{
			if(args[0] == "pussy"){
				const pick = Math.floor(Math.random() * 2);
				var img;
				if (pick == 0){
					img = await nsfw.pussy();
				}else
					img = await nsfw.pussyWankGif();
				const exampleEmbed = new Discord.MessageEmbed()
					.setColor(message.client.colormain)
					.setTitle("Pussy")
					.setImage(img.url);

				return message.channel.send(exampleEmbed);
			}else if(args[0] == "neko"){
				const pick = Math.floor(Math.random() * 2);
				var img;
				if (pick == 0){
					img = await nsfw.neko();
				}else
					img = await nsfw.nekoGif();
				const exampleEmbed = new Discord.MessageEmbed()
					.setColor(message.client.colormain)
					.setTitle("Naked Neko")
					.setImage(img.url);

				return message.channel.send(exampleEmbed);
			}else if(args[0] == "solo"){
				const pick = Math.floor(Math.random() * 2);
				var img;
				if (pick == 0){
					img = await nsfw.girlSolo();
				}else
					img = await nsfw.girlSoloGif();
				const exampleEmbed = new Discord.MessageEmbed()
					.setColor(message.client.colormain)
					.setTitle("Solo action")
					.setImage(img.url);

				return message.channel.send(exampleEmbed);
			}else if(args[0] == "boobs"){
				const pick = Math.floor(Math.random() * 2);
				var img;
				if (pick == 0){
					img = await nsfw.boobs();
				}else
					img = await nsfw.smallBoobs();
				const exampleEmbed = new Discord.MessageEmbed()
					.setColor(message.client.colormain)
					.setTitle("Boobs!")
					.setImage(img.url);

				return message.channel.send(exampleEmbed);
			}else if(args[0] == "lesbian"){
				const img = await nsfw.lesbian();
				const exampleEmbed = new Discord.MessageEmbed()
					.setColor(message.client.colormain)
					.setTitle("Lesbian action")
					.setImage(img.url);

				return message.channel.send(exampleEmbed);
			}else if(args[0] == "cumslut" || args[0] == "cumsluts"){
				const img = await nsfw.cumsluts();
				const exampleEmbed = new Discord.MessageEmbed()
					.setColor(message.client.colormain)
					.setTitle("Cumslut action")
					.setImage(img.url);

				return message.channel.send(exampleEmbed);
			}else if(args[0] == "avatar" || args[0] == "pfp"){
				const img = await nsfw.avatar();
				const exampleEmbed = new Discord.MessageEmbed()
					.setColor(message.client.colormain)
					.setTitle("NSFW PFP")
					.setImage(img.url);

				return message.channel.send(exampleEmbed);
			}
		}
	},
};