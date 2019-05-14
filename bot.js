require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();

const jsonstore = require("jsonstore.io");
let store = new jsonstore(process.env.jsTOKEN);

client.guildstores = [];

client.colormain = 0xffbae9;

//init Tenor client
client.Tenor = require("tenorjs").client({
	"Key": process.env.tenorTOKEN,
	"Filter": "off",
	"Locale": "en_US",
	"MediaFilter": "minimal",
	"DateFormat": "D/MM/YYYY - H:mm:ss A"
});

const { prefix, name } = require("./config.json");

const superagent = require("superagent");

//basic save function for my stoof
client.save = function(){
	var guilds = client.guildstores;
	for (var guild in client.guildstores) {
		//console.log("Saving data to token: "+guilds[guild].token);
		var guildstore = new jsonstore(guilds[guild].token);
		guildstore.write("users",guilds[guild].users);
	}
	console.log("\x1b[33m%s\x1b[0m","[Autosaved data at " + new Date() + "]");
};

setInterval(client.save, 60000*10);

var dataFormat = {
	level: 1,
	exp: 0,
	points: 0,
	money: 0
};

client.on("ready", () => {
	//fancy
	console.log("\x1b[33m%s\x1b[0m",`Logged in as ${client.user.tag}.`);
	console.log("\x1b[32m%s\x1b[0m",`Is in ${client.guilds.size} servers and serving ${client.users.size} users!`);
	console.log("\x1b[35m%s\x1b[0m", `Started at ${client.readyAt.toString()}`);
	if(client.user.username!=name){
		client.user.setUsername(name);
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
							var userdata = JSON.parse(JSON.stringify(dataFormat));
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
});


//COMMAND STUFF BELOW DONT TOUCH//
client.commands = new Discord.Collection();
const commandFiles = [];

var walk = function(dir, done) {
	var results = [];
	fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		var i = 0;
		(function next() {
			var file = list[i++];
			if (!file) return done(null, results);
			file = dir + "/" + file;
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function(err, res) {
						results = results.concat(res);
						next();
					});
				} else {
					results.push(file);
					next();
				}
			});
		})();
	});
};

walk("./commands", function(err, results) {
	if (err) throw err;
	results.forEach(comm => {
		//console.log(comm);
		//console.log(comm.substring(comm.lastIndexOf("/")+1));
		commandFiles.push(comm.substring(comm.lastIndexOf("/")+1));

		if (comm.indexOf(".js")!==-1){
			const command = require(comm);
			var count = (comm.match(new RegExp("/", "g")) || []).length;
			if(count == 3){
				const first = comm.substring(comm.indexOf("/")+1);
				const sec = first.substring(first.indexOf("/")+1);
				const cat = sec.substring(0,sec.indexOf("/"));
				//console.log(cat);
				command.category = cat;
			}
			client.commands.set(command.name, command);
		}
		
	});
});
//COMMAND STUFF ABOVE DONT TOUCH//

client.nextLevel = function(level){
	return Math.round(Math.pow(level, 1.75) + 0.8 * Math.pow(level, 1.25)) + 5;
};

//event handling

client.events = new Discord.Collection();

const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	client.events.set(file, event);
}

client.on("raw", packet =>{
	const localEvent = client.events.has(packet.t+".js");
	if (localEvent){
		console.log("found packet for " + packet.t);
		client.events.get(packet.t+".js").execute(client, Discord, packet);
	}
});

//initialize new member data
client.on("guildMemberAdd", member => {
	if(client.guildstores[member.guild.id].users[member.id] == null){
		var userdata = JSON.parse(JSON.stringify(dataFormat));
		client.guildstores[member.guild.id].users[member.id] = userdata;
	}
});

//Monster I hope to never touch again below.
const cooldowns = new Discord.Collection();
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
client.on("message", async message => {
	if(message.author.bot) return;
	let score;
	if (message.guild) {
		score = client.getScore.get(message.author.id, message.guild.id);
		//make data for new users, will be moved to onguildmemberadded later.
		if (!score) {
			score = JSON.parse(JSON.stringify(dataFormat));
			//just in case kek
			client.guildstores[message.guild.id].users[message.author.id] = score;
		}
		score.points++;
		score.exp++;
		//determine if level up or not
		if(score.exp > client.nextLevel(score.level+1)) {
			score.level++;
			score.exp = 0;
			var embed = new Discord.MessageEmbed()
				.setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ format: "png", size: 512 }))
				.setTitle(message.author.username)
				.addField("**Congrats!**", `You are now level **${score.level}**!!!`, true)
				.setColor(client.colormain)
				.setThumbnail(message.author.displayAvatarURL({ format: "png", size: 512 }));

			message.channel.send({embed: embed});
		}
		client.setScore.run(message.author.id, message.guild.id, score);
	}

	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);
	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== "text") {
		return message.reply("I can't execute that command inside DMs!");
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
  
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
  
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
  
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args, Discord);
	} catch (error) {
		console.error(error);
		message.reply("there was an error trying to execute that command!");
	}
});

require("http").createServer().listen(3000);

client.login(process.env.TOKEN).catch(console.error);