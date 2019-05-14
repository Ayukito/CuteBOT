module.exports = {
	execute(client, Discord, packet) {
		console.log("message");
		console.log(packet.toString());
		client.channels.fetch(packet.d.channel_id).then(channel =>{
			console.log("CHANNEL");
			channel.messages.fetch(packet.d.message_id)
				.then(message => console.log(message.content))
				.catch(console.error);
		});
	}
};