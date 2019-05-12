/* eslint-disable no-unused-vars */
const request = require("request");

module.exports = {
	name: "cat",
	description: "CATS?!",
	execute(message, args, Discord) {
		request.get("http://thecatapi.com/api/images/get?format=src&type=png", {

		}, function(error, response, body) {
			if(!error && response.statusCode == 200) {
				const exampleEmbed = new Discord.MessageEmbed()
					.setColor(message.client.colormain)
					.setTitle("Cat!")
					.setImage(response.request.uri.href);

				return message.channel.send(exampleEmbed);
			} else {
				console.log(error);
			}
		});
	}
};