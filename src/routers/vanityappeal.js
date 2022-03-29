const app = require('express').Router();
const path = require("path")

console.log("[bhbotlist.xyz]: vanity router loaded.");

app.get("/vanityappeals", async (req,res) => {
    res.render("vanityappeal.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles: global.config.server.roles
    })
})

module.exports = app;