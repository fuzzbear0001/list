const app = require('express').Router();
const path = require("path")

console.log("[bhbotlist.xyz]: advertise router loaded.");

app.get("/advertise", async (req,res) => {
    res.render("advertise.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles: global.config.server.roles
    })
})

module.exports = app;