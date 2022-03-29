const app = require('express').Router();
const path = require("path")

console.log("[bhbotlist.xyz]: Terms and Conditions router loaded.");

app.get("/terms&Conditions", async (req,res) => {
    res.render("Term.ejs", {
    	bot: global.Client,
        path: req.path,
        config: global.config,
        user: req.isAuthenticated() ? req.user : null,
        req: req,
        roles: global.config.server.roles
    })
})

module.exports = app;