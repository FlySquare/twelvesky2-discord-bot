const {Client, GatewayIntentBits, Partials, ActivityType, Collection} = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const client = new Client({
    intents: INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});
const fs = require('fs');
const warChannelId = '1054060249985863840';
const warTimeFileName = 'C:/warTime.txt';
const readline = require('readline');
global.client = client;
client.commands = (global.commands = []);
const {readdirSync} = require("fs")
const {TOKEN} = require("./config.json");
readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;
    const props = require(`./commands/${f}`);
    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: props.dm_permission,
        type: 1
    });
    console.log(`[COMMAND] ${props.name} loaded as command.`)
});
readdirSync('./events').forEach(e => {
    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];
    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(`[EVENT] ${name} loaded as event.`)
});
client.login(TOKEN).then(app => {
    client.user.setPresence({
        activities: [{name: `lunaticsky2.online`, type: ActivityType.Playing, url: 'https://lunaticsky2.online'}],
        status: 'Online',
    });
    setInterval(() => {
        if (fs.existsSync(warTimeFileName)) {
            processLineByLine();
        }
    }, 2000);
    console.log(`[BOT] Token is verified.`)
}).catch(app => {
    console.log(`[BOT] Token is not verified.`)
})


async function processLineByLine() {
    const fileStream = fs.createReadStream(warTimeFileName);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        if (line.indexOf("[[295]]") != "-1") {
            if (line.indexOf("(10)") != "-1") {
                sendMessage(10);
            } else if (line.indexOf("(5)") != "-1") {
                sendMessage(5);
            } else if (line.indexOf("(1)") != "-1") {
                sendMessage(1);
            }
        }
    }
}

async function sendMessage(minute = 10) {
    client.channels.fetch(warChannelId).then((channel) => {
        channel.send(`@everyone |
                 [:flag_us:] War will start in ${minute} min!
                 [:flag_tr:] Savaş ${minute} dakika içerisinde başlayacak!
                 [:flag_mc:] Pertempuran akan dimulai dalam ${minute} menit!
                 [:flag_th: ] การต่อสู้จะเริ่มในอีก ${minute} นาที!
                 `);
    });
    fs.unlinkSync(warTimeFileName);
}