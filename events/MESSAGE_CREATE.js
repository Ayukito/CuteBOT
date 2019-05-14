module.exports = {
	execute(client, Discord, packet) {
		console.log("message");
		console.log(packet.d);
		console.log(packet.d.message_id);
		const channel_id = packet.d.channel_id;
		const message_id = packet.d.message_id;
		client.channels.fetch(channel_id).then(channel =>{
			channel.messages.fetch(message_id)
				.then(console.log)
				.catch(console.error);
		});
	}
};