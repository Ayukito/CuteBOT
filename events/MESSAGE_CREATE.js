module.exports = {
	execute(client, Discord, packet) {
		console.log("message");
		console.log(packet.d);
		console.log(packet.d.message_id);
		const channel_id = packet.d.channel_id;
		const message_id = packet.d.message_id;
		client.channels.fetch(channel_id).then(channel =>{
			channel.messages.fetch({around: message_id, limit: 1}).then(messages => {
				const message = messages.first();
				console.log(message);
			});
		});
	}
};