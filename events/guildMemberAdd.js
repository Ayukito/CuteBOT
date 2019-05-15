module.exports = (client, member) =>{
	if(client.getScore(member.id, member.guild.id) == null){
		var userdata = JSON.parse(JSON.stringify(client.dataFormat));
		client.setScore(member.id, member.guild.id, userdata);
	}
	if(client.guildstores[member.guild.id].settings.welcomeChannel != null){
		console.log("DEBUG: Logging to welcome channel");
		const channel = member.guild.channels.find(ch => ch.name === client.guildstores[member.guild.id].settings.welcomeChannel);
		if (channel != null){
			console.log("DEBUG: Found channel");
			if(client.guildstores[member.guild.id].settings.customWelcome != null){
				const p = "Welcome @<$userid> to the server! Their name is $user and their discriminator is $discr!";
				//const p = client.guildstores[member.guild.id].settings.customWelcome;
				const userid = /\$userid/gi;
				const user = /\$user/gi;
				const discr = /\$discr/gi;

				const end = p.replace(userid, member.user.id).replace(discr, member.user.discriminator).replace(user, member.user.username);
				channel.send(end);
			}else{
				channel.send(`<@${member.id}> has joined the server!`);
			}
		}else{
			console.log("DEBUG: No welcome channel set!");
		}
	}
};