const app = require('express').Router();
const Database = require("bhbl.db");
const path = require("path")

console.log("[bhbotlist.xyz]: Ads router loaded.");

app.get("/ads.txt", async (req,res) => {
    res.render("ads.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles: global.config.server.roles
    })
})

module.exports = app;
