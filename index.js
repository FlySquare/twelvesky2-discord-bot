const {Client, GatewayIntentBits, Partials, ActivityType , Collection} = require("discord.js");
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
    console.log(`[BOT] Token is verified.`)
    client.user.setPresence({
        activities: [{ name: `lunaticsky2.online`, type: ActivityType.Playing, url:'https://lunaticsky2.online' }],
        status: 'Online',
    });
    setInterval(()=>{
        if (fs.existsSync(warTimeFileName)) {
            client.channels.fetch(warChannelId).then((channel) => {
                channel.send(`@everyone |
                 [:flag_us:] War will start in 10 min! 
                 [:flag_tr:] Savaş 10 dakika içerisinde başlayacak!
                 [:flag_mc:] Pertempuran akan dimulai dalam 10 menit!
                 [:flag_th: ] การต่อสู้จะเริ่มในอีก 10 นาที! 
                 `);
            });
            fs.unlinkSync(warTimeFileName);
        }
    },2000);
}).catch(app => {
    console.log(`[BOT] Token is not verified.`)
})
