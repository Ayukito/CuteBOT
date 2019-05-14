module.exports = {
	async execute(client, Discord, packet) {
		console.log("message");
		console.log(packet.d);
		console.log(packet.d.message_id);
		const channel_id = packet.d.channel_id;
		const message_id = packet.d.message_id;
		const message = client.getMessage(channel_id, message_id).then( m =>{
			console.log(m);
		});
	}
};