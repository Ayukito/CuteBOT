const superagent = require("superagent");

module.exports = (client) =>{
	//fancy
	console.log("\x1b[33m%s\x1b[0m",`Logged in as ${client.user.tag}.`);
	console.log("\x1b[32m%s\x1b[0m",`Is in ${client.guilds.size} servers and serving ${client.users.size} users!`);
	console.log("\x1b[35m%s\x1b[0m", `Started at ${client.readyAt.toString()}`);
	if(client.user.username!=client.newname){
		client.user.setUsername(client.newname);
	}
	//set activity based on location
	require("dns").lookup(require("os").hostname(), function (err, add) {
		if(add == "10.0.0.63"){
			console.log("\x1b[34m%s\x1b[0m","Running locally!");
			client.user.setActivity("Lynn code me", { type: "WATCHING" });
		}else{
			console.log("\x1b[34m%s\x1b[0m","Running from Heroku or not HOME");
			client.user.setActivity("Host Live!", { type: "PLAYING" });
		}
	});

	// Check if the table "points" exists.
	
};