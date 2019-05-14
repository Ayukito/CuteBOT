module.exports = {
	execute(client, Discord, packet) {
		console.log("message");
		console.log(packet.toString());
		const channel = client.channels.get(packet.d.channel_id);
		const message = channel.fetch(packet.d.message_id);
		console.log(message);
		for (var i in message) {
			console.log(i + ": " + message[i]);
		}
	}
};