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

module.exports.run = async (client,message,args) => {
  if(!message.member.permissions.has('ADMINISTRATOR')) return await message.reply("I think you are not a member of staff team and if you are then you are trying this command in wrong guild.")
  id=(message.mentions.members.first()).user.id;
  rBody = args.slice(1).join(' ');
  if(!rBody) return await message.reply("Provide a resaon to decline bot.")
  if(!id) return await message.reply("Mention a bot to decline")
  const botdata = await botsdata.findOne({
        botID: id
    })
  if (!botdata) return await message.reply("NO SUCH BOT FOUND.")
  await botsdata.deleteOne({
        botID: id,
        ownerID: botdata.ownerID
    });
  client.users.fetch(botdata.ownerID).then(sahip => {
        client.channels.cache.get(channels.botlog).send(`<@${botdata.ownerID}>'s bot named **${botdata.username}** has been declined by <@${message.author.id}>.\nReason:${rBody}`)
        client.users.cache.get(botdata.ownerID).send(`Your bot named **${botdata.username}** has been declined <@${message.author.id}>.\nReason: **${rBody}**\nAuthorized: **${message.author.tag}**`)
    });
  return await message.reply(`Successfully declined the bot.`)
  
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
};
  
exports.help = {
    name: "decline",
    description: "",
    usage: ""
};