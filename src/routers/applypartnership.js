const app = require('express').Router();
const path = require("path")

console.log("[bhbotlist.xyz]: applypartnership router loaded.");

app.get("/applypartnership", async (req,res) => {
    res.render("applypartnership.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles: global.config.server.roles
    })
})

module.exports = app;