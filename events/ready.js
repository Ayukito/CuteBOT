const superagent = require("superagent");

const jsonstore = require("jsonstore.io");
let store = new jsonstore(process.env.jsTOKEN);

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
		if(add == "192.168.1.195"){
			console.log("\x1b[34m%s\x1b[0m","Running locally!");
			client.user.setActivity("Lynn code me", { type: "WATCHING" });
		}else{
			console.log("\x1b[34m%s\x1b[0m","Running from Heroku or not HOME");
			client.user.setActivity("Host Live!", { type: "PLAYING" });
		}
	});

	// Check if the table "points" exists.
	
	//get guild tokens
	client.guilds.forEach(guild => {
		var token;

		let startup = function(){
			//console.log(token);
			//get data
			var guildstore = new jsonstore(token);
			client.guildstores[guild.id] = {
				"token": token,
				users: {},
				settings: {},
				muted: {},
				banned: {}
			};
			//settings
			guildstore.read("settings").then(settings =>{
				client.guildstores[guild.id].settings = settings;
				if (settings == null){
					settings = {};
				}
			});

			//muted
			guildstore.read("muted").then(muted =>{
				client.guildstores[guild.id].muted = muted;
				if (muted == null){
					muted = {};
				}
			});

			//banned
			guildstore.read("banned").then(banned =>{
				client.guildstores[guild.id].banned = banned;
				if (banned == null){
					banned = {};
				}
			});
			//wait for user data to load
			guildstore.read("users").then(users =>{
				client.guildstores[guild.id].users = users;
				guild.members.forEach(member => {
					if (!member.user.bot){
						var data = users[member.id];
						//console.log(data);
						//create data if not found, set after.
						if (data == null){
							var userdata = JSON.parse(JSON.stringify(client.dataFormat));
							guildstore.write("users/"+member.id, userdata);
	
							client.guildstores[guild.id].users[member.id] = userdata;
							//console.log("Created userdata for "+member.user.username + " in server: " + guild.name);
						}
					}
				});
			});
			
		};
		//read guilds, create token for missing guilds and then load the guild data
		store.read(guild.id).then(data =>{
			if (data == null){
				superagent
					.get("https://www.jsonstore.io/get-token")
					.then(resp=>{
						//console.log("Creating new token: "+resp.body.token + "\nfor server "+guild.name);
						store.write(guild.id, resp.body.token);
						token = resp.body.token;
						startup();
					});
			}else{
				//console.log("Found token: "+data + "\nfor server "+guild.name);
				token = data;
				startup();
			}
			
		});
		
		//ugly replacement code for sqlite3 because I'm lazy
		client.getScore = {};
		client.getScore.get = function(authorid, guildid){
			//console.log("got data of "+ authorid + " in " + guildid);
			return client.guildstores[guildid].users[authorid];
		};

		client.setScore = {};
		client.setScore.run = function(authorid, guildid, score){
			//console.log("set data of "+ authorid + " in " + guildid + " to:\n"+score);
			client.guildstores[guildid].users[authorid] = score;
		};
	});
};