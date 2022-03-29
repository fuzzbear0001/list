const app = require('express').Router();
const botsdata = require("../../../database/models/botlist/bots.js");
const path = require("path");
const client = global.Client;
const { Canvas, resolveImage } = require('canvas-constructor/cairo');
const { registerFont } = require("canvas");


console.log("[bhbotlist.xyz]: Botlist/Botembed view router loaded.");
app.get("/bot/:botID/embed", async (req, res, next) => {
    let bot = await botsdata.findOne({
        botID: req.params.botID
    });
    if(!bot) return res.redirect("/error?code=404&message=You entered an invalid bot id.");
    try {
      let owner = client.users.cache.get(bot.ownerID);
      let geting = client.users.cache.get(req.params.id);
      var forav = bot.avatar || 'https://bhbotlist.xyz/img/undefined_avatar.png';
      var forav = forav.replace(".webp", ".png")
      let avatar = await resolveImage(forav);
      var str = bot.shortDesc
      var shortDesc = str.substring(0, 53);
      registerFont('src/fonts/font.ttf', { family: 'vCodes' })

      let img = new Canvas(500, 250)
        .setColor("#3A3B3C")
        .printRectangle(0, 0, 500, 250)
        .setColor("#DCE2F9")
        .setTextFont('bold 35px sans')
        .printText(bot.username, 120, 75)
        .printRoundedImage(avatar, 25, 25, 70, 70, 100)
        .setTextAlign("left")
        .setTextFont('bold 16px Verdana')
      img.printText(`${bot.serverCount || "N/A"} Servers  ${bot.votes} Votes`, 30, 125);
      img
        .printText(`Prefix: ${bot.prefix}`, 30, 145)
        .setTextFont('normal 16px Verdana')
        .printWrappedText(`${shortDesc}....`, 30, 175, 440, 15)

        .setColor("#5656f0")
        .printRectangle(0, 220, 500, 450)
        .setColor("#DCE2F9")
        .setTextFont('bold 20px sans')
        .printText(`FUZZLIST.XYZ`, 175, 245);
      if(bot.premium==='Premium') {
        img
          .setColor("#5656f0")
          .printRectangle(0, 220, 500, 450)
          .setColor("#DCE2F9")
          .setTextFont('bold 20px sans')
          .printText(`PROMOTED BY FUZZLIST.XYZ`, 175, 245);
      }
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(await img.toBuffer(), "binary");
    } catch (e) {
      console.log(e)
      res.redirect("/error?code=500&message=Something went wrong.");
    }
});
module.exports = app;