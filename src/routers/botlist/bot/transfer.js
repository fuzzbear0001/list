const app = require('express').Router();
const botsdata = require("../../../database/models/botlist/bots.js");
const client = global.Client;
const channels = global.config.server.channels;

console.log("[disbots.xyz/servers]: Transfer owner router loaded.");

app.get("/bot/:botID/transfer", global.checkAuth, async (req, res) => {
  let botdata = await botsdata.findOne({
        botID: req.params.botID
    });
    if (!botdata) return res.redirect("/error?code=404&message=You entered an invalid user id.")
    if (req.user.id == botdata.ownerID || botdata.coowners.includes(req.user.id)) {
        res.render("botlist/bot/transfer.ejs", {
            bot: global.Client,
            path: req.path,
            config: global.config,
            user: req.isAuthenticated() ? req.user : null,
            req: req,
            roles:global.config.server.roles,
            channels: global.config.server.channels,
            botdata: botdata
        })
    } else {
        res.redirect("/error?code=404&message=To transfer this bot, you must be its owners.");
    }
});


app.post("/bot/:botID/transfer", global.checkAuth, async (req, res) => {
    let rBody = req.body;
    if(!client.guilds.cache.get(config.server.id).members.cache.get(rBody['userID'])) return res.redirect("/error?code=403&message=To do this, The user must be in server.");
    client.users.fetch(req.body.userID).then(async a => {
      if(!a.bot === false)  return res.send({
          error: true,
          message: "Woah! You cant transfer ownership to bot"
      });
      if (!req.params.botID || !rBody['userID']) return res.send({
          error: true,
          message: "Fill the must any blanks."
      });
      
      if (rBody['userID'] === (req.user.id)) return res.send({
          error: true,
          message: "You cannot transfer bot to yourself."
      });
      await botsdata.findOneAndUpdate({
          botID: req.params.botID
      }, {
          set: {
              ownerID: rBody['userID'],
          }
      }, function(err, docs) { })
      return res.send({
          success: true,
          message: "Successfully Transfered Owner"
      });
    })
})

module.exports = app;
