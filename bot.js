require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();

const jsonstore = require("jsonstore.io");

client.guildstores = [];

client.colormain = 0xffbae9;

client.dataFormat = {
	level: 1,
	exp: 0,
	points: 0,
	money: 0
};
//hi
//init Tenor client
client.Tenor = require("tenorjs").client({
	"Key": process.env.tenorTOKEN,
	"Filter": "off",
	"Locale": "en_US",
	"MediaFilter": "minimal",
	"DateFormat": "D/MM/YYYY - H:mm:ss A"
});

const { prefix, name } = require("./config.json");
client.prefix = prefix;
client.newname = name;

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

//event handling
client.events = new Discord.Collection();

fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));
	});
});

//
//
//
//
//
//

//determine the exp for the level
client.nextLevel = function(level){
	return Math.round(Math.pow(level, 1.75) + 0.8 * Math.pow(level, 1.25)) + 5;
};

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

require("http").createServer().listen(3000);
client.login(process.env.TOKEN).catch(console.error);