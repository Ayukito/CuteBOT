module.exports = {
	execute(client, Discord, packet) {
		console.log("message");
		console.log(packet.toString());
		const channel = client.channels.get(packet.d.channel_id);
		channel.fetch(packet.d.message_id).then(message =>{
			console.log(message);
			console.log(message.author);
		});
	}
};