require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();

const SQLite = require("better-sqlite3");
client.sql = new SQLite("./scores.sqlite");

client.colormain = 0xffbae9;

client.Tenor = require("tenorjs").client({
	"Key": "2FFV1PW12XXM", // https://tenor.com/developer/keyregistration
	"Filter": "off", // "off", "low", "medium", "high", not case sensitive
	"Locale": "en_US", // Your locale here, case-sensitivity depends on input
	"MediaFilter": "minimal", // either minimal or basic, not case sensitive
	"DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});

const { prefix, name } = require("./config.json");

client.on("ready", () => {
	console.log("\x1b[33m%s\x1b[0m",`Logged in as ${client.user.tag}.`);
	console.log("\x1b[32m%s\x1b[0m",`Is in ${client.guilds.size} servers and serving ${client.users.size} users!`);
	console.log("\x1b[35m%s\x1b[0m", `Started at ${client.readyAt.toString()}`);
	if(client.user.username!=name){
		client.user.setUsername(name);
	}

	// Check if the table "points" exists.
	const table = client.sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
	if (!table["count(*)"]) {
		// If the table isn't there, create it and setup the database correctly.
		client.sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER, money INTEGER);").run();
		// Ensure that the "id" row is always unique and indexed.
		client.sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
		client.sql.pragma("synchronous = 1");
		client.sql.pragma("journal_mode = wal");
	}
 
	// And then we have two prepared statements to get and set the score data.
	client.getScore = client.sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
	client.setScore = client.sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level, money) VALUES (@id, @user, @guild, @points, @level, @money);");
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
  
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
client.on("message", async message => {
	if(message.author.bot) return;
	let score;
	if (message.guild) {
		score = client.getScore.get(message.author.id, message.guild.id);
		if (!score) {
			score = {
				id: `${message.guild.id}-${message.author.id}`,
				user: message.author.id,
				guild: message.guild.id,
				points: 0,
				level: 1,
				money: 0
			};
		}
		score.points++;
		const curLevel = Math.round(0.25 * Math.sqrt(score.points));
		if(score.level < curLevel) {
			score.level++;
			var embed = new Discord.MessageEmbed()
				.setAuthor(message.client.user.username, message.client.user.displayAvatarURL({ format: "png", size: 512 }))
				.setTitle(message.author.username)
				.addField("**Congrats!**", `You are now level **${curLevel}**!!!`, true)
				.setColor(client.colormain)
				.setThumbnail(message.author.displayAvatarURL({ format: "png", size: 512 }));

			message.channel.send({embed: embed});
		}
		client.setScore.run(score);
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

if (!("OPENSHIFT_DATA_DIR" in process.env)) {
	console.log(process.env);
	throw new Error("Can't access data directory");
}

require("http").createServer().listen(3000);

client.login(process.env.TOKEN).catch(console.error);