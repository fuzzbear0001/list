
const url = require("url");
  const path = require("path");
  const express = require("express");
  const passport = require("passport");
  const session = require("express-session");
  const Strategy = require("passport-discord").Strategy;
  const ejs = require("ejs");
  const bodyParser = require("body-parser");
  const Discord = require("discord.js");
  const config = require("../config.js");
  const channels = config.server.channels;
  const app = express();
  const MemoryStore = require("memorystore")(session);
  const fetch = require("node-fetch");
  const cookieParser = require('cookie-parser');
  const referrerPolicy = require('referrer-policy');
  const roles = global.config.server.roles;
  app.use(referrerPolicy({ policy: "strict-origin" }))
  const rateLimit = require("express-rate-limit");
  const botsdata = require("./database/models/botlist/bots.js");
  const appsdata = require("./database/models/botlist/certificate-apps.js");
  var MongoStore = require('rate-limit-mongo');

  // MODELS
  const banSchema = require("./database/models/site-ban.js");

  module.exports = async (client) => {

    const apiLimiter = rateLimit({
      store: new MongoStore({
         uri: global.config.bot.mongourl,
         collectionName: "rate-limit",
         expireTimeMs:  60 * 60 * 1000,
         resetExpireDateOnChange: true
         }),
           windowMs: 60 * 60 * 1000,
           max: 4,
           message:
       ({ error: true, message:  "Too many requests, you have been rate limited. Please try again in one hour." })
    });

    var minifyHTML = require('express-minify-html-terser');
    app.use(minifyHTML({
        override:      true,
        exception_url: false,
        htmlMinifier: {
            removeComments:            true,
            collapseWhitespace:        true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes:     true,
            removeEmptyAttributes:     true,
            minifyJS:                  true
        }
    }));

    app.set('views', path.join(__dirname, '/views'));
    const templateDir = path.resolve(`${process.cwd()}${path.sep}src/views`);
    app.use("/css", express.static(path.resolve(`${templateDir}${path.sep}assets/css`)));
    app.use("/js", express.static(path.resolve(`${templateDir}${path.sep}assets/js`)));
    app.use("/img", express.static(path.resolve(`${templateDir}${path.sep}assets/img`)));
  
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));
  
    passport.use(new Strategy({
      clientID: config.website.clientID,
      clientSecret: config.website.secret,
      callbackURL: config.website.callback,      
      scope: ["identify", "guilds", "guilds.join"]
    },
    (accessToken, refreshToken, profile, done) => { 
      process.nextTick(() => done(null, profile));
    }));
  
    app.use(session({
      store: new MemoryStore({ checkPeriod: 86400000 }),
      secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
      resave: false,
      saveUninitialized: false,
    }));
  
    app.use(passport.initialize());
    app.use(passport.session());
  
  
    app.engine("vcodes-xyz", ejs.renderFile);
    app.set("view engine", "vcodes-xyz");
  
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));
  
    global.checkAuth = (req, res, next) => {
      if (req.isAuthenticated()) return next();
      req.session.backURL = req.url;
      res.redirect("/login");
    }
    

   app.get("/login", (req, res, next) => {
      if (req.session.backURL) {
        req.session.backURL = req.session.backURL; 
      } else if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === app.locals.domain) {
          req.session.backURL = parsed.path;
        }
      } else {
        req.session.backURL = "/";
       }
      next();
    },
    passport.authenticate("discord", { prompt: 'none' }));
    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/error?code=999&message=We encountered an error while connecting." }), async (req, res) => {
        let banned = await banSchema.findOne({user: req.user.id})
        if(banned) {
        client.users.fetch(req.user.id).then(async a => {
        client.channels.cache.get(channels.login).send(new Discord.MessageEmbed().setAuthor(a.username, a.avatarURL({dynamic: true})).setThumbnail(a.avatarURL({dynamic: true})).setColor("RED").setDescription(`[**${a.username}**#${a.discriminator}](https://bhbotlist.xyz/user/${a.id}) tried to login but was blacklisted from the website.`).addField("Username", a.username + "#" + a.discriminator).addField("User ID", a.id))
        })
        req.session.destroy(() => {
        res.json({ login: false, message: "You have been blacklisted from BHBotlist.", logout: true })
        req.logout();
        });
        } else {
            try {
              const request = require('request');
              request({
                  url: `https://discordapp.com/api/v8/guilds/${config.server.id}/members/${req.user.id}`,
                  method: "PUT",
                  json: { access_token: req.user.accessToken },
                  headers: { "Authorization": `Bot ${client.token}` }
              });
        } catch {};
        res.redirect(req.session.backURL || '/')
        client.users.fetch(req.user.id).then(async a => {
        client.channels.cache.get(channels.login).send(new Discord.MessageEmbed().setAuthor(a.username, a.avatarURL({dynamic: true})).setThumbnail(a.avatarURL({dynamic: true})).setColor("GREEN").setDescription(`[**${a.username}**#${a.discriminator}](https://bhbotlist.xyz/user/${a.id}) just logged in.`).addField("Username", a.username + "#" + a.discriminator).addField("User ID", a.id))
        
        })
        }
    });
    app.get("/logout", function (req, res) {
      req.session.destroy(() => {
        req.logout();
        res.redirect("/");
      });
    });

const renderTemplate = (res, req, template, data = {}) => {
  const baseData = {
    bot: client,
    path: req.path,
    _token: req.session['_token'],
    user: req.isAuthenticated() ? req.user : null
  };
  res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
};

const checkAdmin = async (req, res, next) => {
  if (req.isAuthenticated()) {
    if(client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(global.config.server.roles.administrator) || client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(global.config.server.roles.moderator) || req.user.id === "671390595184459782") {
      next();
  } else {
    res.redirect("/error?code=403&message=You are not allowed to access this page.")
    }
} else {
  req.session.backURL = req.url;
  res.redirect("/login");
  }
}

app.get("/bots/premium", async (req, res) => {
        let page = req.query.page || 1;
        let x = await botsdata.find()
        let data = x.filter(b => b.premium === "Premium")
        if (page < 1) return res.redirect(`/bots`);
        if (data.length <= 0) return res.redirect("/");
        if ((page > Math.ceil(data.length / 6))) return res.redirect(`/bots`);
        if (Math.ceil(data.length / 6) < 1) {
            page = 1;
        };
        renderTemplate(res, req, "botlist/bots-premium.ejs", {
            req,
            roles,
            config,
            data,
            page: page
        });
})

app.get("/admin/premium-bots", checkAdmin, checkAuth, async (req, res) => {
    const botdata = await botsdata.find();
    renderTemplate(res, req, "admin/premium-bots.ejs", {
      req,
      roles,
      config,
      botdata
    })
  });
    app.get("/admin/premium/give/:botID", checkAdmin, checkAuth, async (req, res) => {
        await botsdata.findOneAndUpdate({
            botID: req.params.botID
        }, {
            $set: {
                premium: "Premium",
            }
        }, function(err, docs) {})
        let botdata = await botsdata.findOne({
            botID: req.params.botID
        });

        client.users.fetch(botdata.botID).then(bota => {
            client.channels.cache.get(channels.botlog).send(`<@${botdata.ownerID}>'s bot  **${bota.tag}** has been **Promoted**.`)
            client.users.cache.get(botdata.ownerID).send(`Your bot named **${bota.tag}** has been **Promoted**.`)
        });
        let guild = client.guilds.cache.get(config.server.id)
        guild.members.cache.get(botdata.botID).roles.add(roles.botlist.premium_bot);
        guild.members.cache.get(botdata.ownerID).roles.add(roles.botlist.premium_developer);
        if (botdata.coowners) {
            botdata.coowners.map(a => {
                if (guild.members.cache.get(a)) {
                    guild.members.cache.get(a).roles.add(roles.botlist.premium_developer);
                }
            })
        }
        return res.redirect(`/admin/premium-bots?success=true&message=premium gived.&botID=${req.params.botID}`)
    });

app.get("/admin/premium/delete/:botID", checkAdmin, checkAuth, async (req, res) => {
        let rBody = req.body;
        await botsdata.findOneAndUpdate({
            botID: req.params.botID
        }, {
            $set: {
                premium: "None",
            }
        }, function(err, docs) {})
        let botdata = await botsdata.findOne({
            botID: req.params.botID
        });
        client.users.fetch(botdata.botID).then(bota => {
            client.channels.cache.get(channels.botlog).send(`<@${botdata.ownerID}>'s bot named **${bota.tag}**'s premium has been removed.`)
            client.users.cache.get(botdata.ownerID).send(`Your bot named **${bota.tag}**'s premium has been removed.`)
        });
        await appsdata.deleteOne({
            botID: req.params.botID
        })
        let guild = client.guilds.cache.get(config.server.id)
        guild.members.cache.get(botdata.botID).roles.remove(roles.botlist.premium_bot);
        guild.members.cache.get(botdata.ownerID).roles.remove(roles.botlist.premium_developer);
        return res.redirect(`/admin/premium-bots?success=true&message=premium deleted.`)
    });

app.get("/admin/news", checkAdmin, checkAuth, async (req, res) => {
  if (!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
  const Database = require("bhbl.db");
  const db = new Database(path.join(__dirname, './database/json/news.json'));
  renderTemplate(res, req, "/admin/administrator/news.ejs", { req, roles, config, db })
});
app.post("/admin/news", checkAdmin, checkAuth, async (req, res) => {
  if (!config.bot.owners.includes(req.user.id)) return res.redirect('../admin');
  const Database = require("bhbl.db");
  const db = new Database(path.join(__dirname, './database/json/news.json'));
  const datum = new Date().toLocaleString();
  db.push(`news`, {
    code: createID(12),
    icon: req.body.icon,
    banner: 'https://media.discordapp.net/attachments/832615475878821939/861598860006522890/wallpaper.jpg?width=1246&height=701',
    ownerID: req.user.id,
    serverName: req.body.serverName,
    color: req.body.color,
    rank: req.body.rank,
    date: datum,
    description: req.body.partnerDesc,
    views: 0
  })
  let rBody = req.body;


  const webhook = require("webhook-discord");

  const Hook = new webhook.Webhook("");
  const msg = new webhook.MessageBuilder()
    .setName('News')
    .setAvatar(req.body.icon)
    .setTitle(req.body.serverName)
    .setDescription(`<@${req.user.id}> Posted a new announcement \n\nCheck it on our [Website](https://bhbotlist.xyz/news)`)
    .setColor('#0099ff')
    .setFooter(`Copyright © bhbotlist.xyz`)
  Hook.send(msg);


  return res.redirect('/admin/news?success=true&message=Announcement sent.')

});
function createID(length) {
  var result = '';
  var characters = '123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
app.get("/news", (req, res) => {
  const Database = require("bhbl.db");
  const db = new Database(path.join(__dirname, './database/json/news.json'));
  renderTemplate(res, req, "news.ejs", { roles, config, db: db, req: req });
});

  
    app.use(async (req, res, next) => {
        var getIP = require('ipware')().get_ip;
        var ipInfo = getIP(req);
        var geoip = require('geoip-lite');
        var ip = ipInfo.clientIp;
        var geo = geoip.lookup(ip);
        
        if(geo) {
          let sitedatas = require("./database/models/analytics-site.js")
          await sitedatas.updateOne({ id: config.website.clientID }, {$inc: {[`country.${geo.country}`]: 1} }, { upsert: true})
        }
        return next();
    })


    //------------------- Routers -------------------//

    /* General */
    console.clear();
    /*
      (WARN)
      You can delete the log here, but you cannot write your own name in the Developed by section.
      * log = first console.log
    */
    console.log(`
      [===========================================]
                       bhbotlist.xyz
        https://github.com/bhbotlist-xyz/
                Developed by BHBL

                    Achievements =)
      [===========================================]
      `)
    console.log("\x1b[32m", "System loading, please wait...")
    sleep(1050)
    console.clear();
    console.log('\x1b[36m%s\x1b[0m', "[bhbotlist.xyz]: General routers loading...");
    sleep(500);
    app.use("/", require('./routers/index.js'))
    app.use("/", require('./routers/partners.js'))
    app.use("/", require('./routers/ads.js'))
    app.use("/", require('./routers/privacypolicy.js'))
    app.use("/", require('./routers/Term.js'))
    app.use("/", require('./routers/status.js'))
    app.use("/", require('./routers/news.js'))
    app.use("/", require('./routers/team.js'))
    app.use("/", require('./routers/mini.js'))

   
/* Botlist new files  */
    app.use("/", require('./routers/thankyou.js'))
    app.use("/", require('./routers/thank-you.js'))
    app.use("/", require('./routers/thank--you.js'))
    app.use("/", require('./routers/reviewers.js'))
    app.use("/", require('./routers/vanityappeal.js'))
    app.use("/", require('./routers/applypartnership.js'))
    app.use("/", require('./routers/client.js'))
    app.use("/", require('./routers/appeals.js'))
    app.use("/", require('./routers/working.js'))
    app.use("/", require('./routers/widget.js'))
    app.use("/", require('./routers/advertise.js'))



   /* Botlist new premium bot files  */
    app.use("/",require('./routers/bot/scoopy.js'))
   
 

    const http = require('http').createServer(app);
    const io = require('socket.io')(http);
    io.on('connection', socket => {
        io.emit("userCount", io.engine.clientsCount);
    });
    http.listen(3000, () => { console.log("[bhbotlist.xyz]: Website running port 3000.")});
   
    /* Uptime System */
    console.log(" ")
    console.log('\x1b[36m%s\x1b[0m', "[bhbotlist.xyz]: Uptime system routers loading...");
    sleep(500);
    app.use("/uptime", require('./routers/uptime/add.js'))
    app.use("/uptime", require('./routers/uptime/delete.js'))
    app.use("/uptime", require('./routers/uptime/links.js'))

    /* Profile System */
    console.log(" ")
    console.log('\x1b[36m%s\x1b[0m', "[bhbotlist.xyz]: Profile system routers loading...");
    sleep(500);
    app.use("/user", require('./routers/profile/index.js'))
    app.use("/", require('./routers/profile/embed.js'))
    app.use("/user", require('./routers/profile/edit.js'))

    /* Code Share System */
    console.log(" ")
    console.log('\x1b[36m%s\x1b[0m', "[bhbotlist.xyz]: Code Share system routers loading...");
    sleep(500);
    app.use("/codes", require('./routers/codeshare/view.js'))
    app.use("/codes", require('./routers/codeshare/list.js'))
    app.use("/codes", require('./routers/codeshare/categories.js'))

    /* Botlist System */
    console.log(" ")
    console.log('\x1b[36m%s\x1b[0m', "[bhbotlist.xyz]: Botlist system routers loading...");
    sleep(500);
    app.use("/", require('./routers/botlist/addbot.js'))
    app.use("/", require('./routers/botlist/mini.js'))
    app.use("/", require('./routers/botlist//apps/cerificate-app.js'))
    app.use("/", require('./routers/botlist/vote.js'))
    app.use("/", require('./routers/botlist/bot/view.js'))
    app.use("/", require('./routers/botlist/bot/edit.js'))
    app.use("/", require('./routers/botlist/bot/transfer.js'))
    app.use("/", require('./routers/botlist/bot/embed.js'))
    app.use("/", require('./routers/botlist/bot/analytics.js'))
    app.use("/", require('./routers/botlist/apps/cerificate-app.js'))

    /* Server List System */
    console.log(" ")
    console.log('\x1b[36m%s\x1b[0m', "[bhbotlist.xyz]: Serverlist system routers loading...");
    sleep(500);
    app.use("/servers", require('./routers/servers/index.js'))
    app.use("/news", require('./routers/news.js'))
    app.use("/server", require('./routers/servers/add.js'))
    app.use("/servers", require('./routers/servers/tags.js'))
    app.use("/servers", require('./routers/servers/search.js'))
    app.use("/servers", require('./routers/servers/tag.js'))
    app.use("/server", require('./routers/servers/server/view.js'))
    app.use("/server", require('./routers/servers/server/edit.js'))
    app.use("/server", require('./routers/servers/server/join.js'))
    app.use("/server", require('./routers/servers/server/analytics.js'))
    app.use("/server", require('./routers/servers/server/delete.js'))

    /* Admin Panel */
    app.use(async (req, res, next) => {
       if(req.path.includes('/admin')) {
        if (req.isAuthenticated()) {
          if(client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(global.config.server.roles.administrator) || client.guilds.cache.get(config.server.id).members.cache.get(req.user.id).roles.cache.get(global.config.server.roles.moderator) || req.user.id === "671390595184459782") {
              next();
              } else {
              res.redirect("/error?code=403&message=You are not allowed to access this page.")
          }
        } else {
          req.session.backURL = req.url;
          res.redirect("/login");
        }
       } else {
           next();
       }
    })
    console.log(" ")
    console.log('\x1b[36m%s\x1b[0m', "[bhbotlist.xyz]: Admin Panel system routers loading...");
    sleep(500);
    app.use("/", require('./routers/admin/index.js'))
    app.use("/", require('./routers/admin/ban.js'))
    app.use("/", require('./routers/admin/partner.js'))
    app.use("/", require('./routers/admin/botlist/confirm.js'))
    app.use("/", require('./routers/admin/botlist/decline.js'))
    app.use("/", require('./routers/admin/botlist/delete.js'))
    app.use("/", require('./routers/admin/botlist/certificate/give.js'))
    app.use("/", require('./routers/admin/botlist/certificate/decline.js'))
    app.use("/", require('./routers/admin/codeshare/index.js'))
    app.use("/", require('./routers/admin/codeshare/edit.js'))
    app.use("/", require('./routers/admin/codeshare/add.js'))
    app.use("/", require('./routers/admin/uptime/index.js'))


    /* Bot System */
    console.log(" ")
    console.log('\x1b[36m%s\x1b[0m', "[bhbotlist.xyz]: Bot system loading...");
    app.use("/", require('./routers/api/api.js'))
    sleep(500)

    app.use((req, res) => {
        req.query.code = 404;
        req.query.message = `Page not found.`;
        res.status(404).render("error.ejs", {
            bot: global.Client,
            path: req.path,
            config: global.config,
            user: req.isAuthenticated() ? req.user : null,
            req: req,
            roles:global.config.server.roles,
            channels: global.config.server.channels
        })
    });
  };

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
