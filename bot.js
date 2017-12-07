const Discord = require("discord.js");
const client = new Discord.Client();
const sql = require("sqlite")
sql.open("./albums.sqlite");

client.on("ready", () => {
    console.log("I am ready!");
});

client.on("message", message => {
    if (message.author.bot) return;
    if (message.content[0] === '!') {
        cmd = message.content.split(/[\s!]+/)[1].toLowerCase();
        params = message.content.substring(cmd.length + 1, message.content.length).trim();
        switch(cmd) {
            case "nominate":
                album = params.split(" - ")[0];
                artist = params.split(" - ")[1];
                sql.get(`SELECT * FROM database`).then(row => {
                    sql.run("INSERT INTO albums (album, artist, userID) VALUES (?, ?, ?)", [album, artist, message.author.id]);
                    console.log(message.author.id + " added " + params);
                    message.channel.send(message.author.id + " added " + params);
                }).catch(() => {
                    console.error;
                    sql.run("CREATE TABLE IF NOT EXISTS albums (album TEXT, artist TEXT, userID TEXT)").then(() => {
                        sql.run("INSERT INTO albums (album, artist, userID) VALUES (?, ?, ?)", [album, artist, message.author.id]);
                    });
                });
        }
    }
});

client.login(process.env.BOT_TOKEN);