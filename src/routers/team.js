const app = require('express').Router();
const path = require("path")

console.log("[bhbotlist.xyz]: Teams router loaded.");

app.get("/teams", async (req,res) => {
    res.render("team.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles: global.config.server.roles
    })
})

module.exports = app;