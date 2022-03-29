const app = require('express').Router();
const path = require("path")

console.log("[bhbotlist.xyz]: thank--you router loaded.");

app.get("/thank--you", async (req,res) => {
    res.render("thank--you.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles: global.config.server.roles
    })
})

module.exports = app;