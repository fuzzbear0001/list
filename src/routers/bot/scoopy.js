const app = require('express').Router();
const path = require("path")

console.log("[bhbotlist.xyz]: scoopy router loaded.");

app.get("/bot/scoopy", async (req,res) => {
    res.render("bot/scoopy.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles: global.config.server.roles
    })
})

module.exports = app;