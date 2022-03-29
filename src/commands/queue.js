const botsdata = require("../database/models/botlist/bots.js");
const codesSchema = require("../database/models/codes.js");
const uptimedata = require("../database/models/uptime.js");
const appsdata = require("../database/models/botlist/certificate-apps.js");
const Discord = require('discord.js');
const vcodes = require("vcodes.js");
let sitedatalari = require("../database/models/analytics-site.js");

const roles = global.config.server.roles;
const channels = global.config.server.channels;
const client = global.Client;

module.exports.run = async (client,message) => {
  if(!message.member.permissions.has('ADMINISTRATOR')) return await message.reply("I think you are not a member of staff team and if you are then you are trying this command in wrong guild.")
  let x = await botsdata.find();
  let bots = await x.filter(a => a.status === "UnApproved")
  try {
   const embed = new Discord.MessageEmbed()
   .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
   .setDescription(`**Total ${bots.length} bots in queue.**`)
   .setColor("#7289da")
   .addField("Bots", `${!bots ? "" : bots.map(a => `bot:${a.username}\nbot invit link: https://bhbotlist.xyz/bot/${a.botID}/invite`).join("\n")}`, true)
  await message.channel.send(embed); 
  } catch {
    await message.reply(`Total bots in queue ${bots.length}`)
  }
  
};
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
  };
  
exports.help = {
  name: "queue",
  description: "",
  usage: ""
  };