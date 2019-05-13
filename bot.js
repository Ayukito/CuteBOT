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
	
	client.guilds.forEach(guild => {
		var token;

		let startup = function(){
			//console.log(token);
			var guildstore = new jsonstore(token);
			client.guildstores[guild.id] = {
				"token": token,
				users: guildstore.read("users"),
				settings: guildstore.read("settings"),
				muted: guildstore.read("muted"),
				banned: guildstore.read("banned")
			};
			guild.members.forEach(member => {
				if (!member.user.bot){
					var data = client.guildstores[guild.id].users[member.id];
					if (data == null){
						var userdata = {
							level: 1,
							exp: 0,
							points: 0,
							money: 0
						};
						guildstore.write("users/"+member.id, userdata);

						client.guildstores[guild.id].users[member.id] = userdata;
						//console.log("Created userdata for "+member.user.username + " in server: " + guild.name);
					}else{
						console.log("found userdata for "+member.user.username + " in server: " + guild.name);
						client.guildstores[guild.id].users[member.id] = data;
					}
				}
			});
		};

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

client.commands = new Discord.Collection();
const commandFiles = [];//fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const cooldowns = new Discord.Collection();

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

/*for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}*/

client.nextLevel = function(level){
	return Math.round(Math.pow(level, 1.75) + 0.8 * Math.pow(level, 1.25)) + 5;
};

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
client.on("message", async message => {
	if(message.author.bot) return;
	let score;
	if (message.guild) {
		score = client.getScore.get(message.author.id, message.guild.id);
		if (!score) {
			score = {
				level: 1,
				exp: 0,
				points: 0,
				money: 0
			};
		}
		score.points++;
		score.exp++;
		
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