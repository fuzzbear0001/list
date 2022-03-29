const app = require('express').Router();
const path = require("path")

console.log("[bhbotlist.xyz]: appeals router loaded.");

app.get("/appeals", async (req,res) => {
    res.render("appeals.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles: global.config.server.roles
    })
})

module.exports = app;