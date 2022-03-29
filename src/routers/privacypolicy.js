const app = require('express').Router();
const path = require("path")

console.log("[bhbotlist.xyz]: privacypolicy router loaded.");

app.get("/privacypolicy", async (req,res) => {
    res.render("privacypolicy.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles: global.config.server.roles
    })
})

module.exports = app;