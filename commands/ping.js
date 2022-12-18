const { Client, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Bot'un ping değerlerini öğrenirsiniz",
  type: 1,
  options: [],

  run: async(client, interaction) => {
    interaction.reply({ embeds: [ new EmbedBuilder().setDescription(`Created by <@375624283331887104> | Server Ping: ***${client.ws.ping}ms***`) ], ephemeral: true })
  }
};
