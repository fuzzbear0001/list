const app = require('express').Router();
const path = require("path")

console.log("[bhbotlist.xyz]: Status router loaded.");

app.get("/status", async (req,res) => {
    res.render("status.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles: global.config.server.roles
    })
})

module.exports = app;