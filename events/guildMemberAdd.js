module.exports = (client, member) =>{
	if(client.guildstores[member.guild.id].users[member.id] == null){
		var userdata = JSON.parse(JSON.stringify(client.dataFormat));
		client.guildstores[member.guild.id].users[member.id] = userdata;
	}
};