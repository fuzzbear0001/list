
module.exports = {
  bot: {
    token: process.env.Tokenmain,//your bot token for botlist
    prefix: process.env.prefix,//your bot prefix for botlist
    owners: ["938171799139655700","831181411448651796"],//owners id
    mongourl: process.env.mongo,//mongodb url
    servers: {
      token: process.env.servers,//your bot token for serverlist
      prefix: process.env.serverprefix,
    }
  },

  website: {
    callback: process.env.callback,//callback url https://domain.com/callback
    secret: process.env.secret,//your botlist bot's client secret
    clientID: process.env.clientID, // botlist Bot client id.
    tags: ["Moderation", "Fun", "Minecraft", "Economy", "Guard", "NSFW", "Anime", "Invite", "Music", "Logging", "Web Dashboard", "Reddit", "Youtube", "Twitch", "Crypto", "Leveling", "Game", "Roleplay", "Utility", "India"],
    languages: [
      { flag: 'us', code: 'af', name: 'Afrikaans' },
      { flag: 'us', code: 'en', name: 'English' }, 
      { flag: 'in', code: 'hi', name: 'हिंदी' },
      { flag: 'pt', code: 'pt', name: 'Português' },
      { flag: 'es', code: 'es', name: 'Español' },
      { flag: 'fr', code: 'fr', name: 'Français' },
      { flag: 'de', code: 'de', name: 'Deutsch' },
      { flag: 'al', code: 'al', name: 'Albanian' },
      { flag: 'ru', code: 'ru', name: 'Russian' },
      { flag: 'cn', code: 'cn', name: 'Chinese' },
      { flag: 'tr', code: 'tr', name: 'Turkish' },
    ],
    servers: {
      tags: [
        {
          icon: "fal fa-code",
          name: "Development"
        },
        {
          icon: "fal fa-play",
          name: "Stream"
        },
        {
          icon: "fal fa-camera",
          name: "Media"
        },
        {
          icon: 'fal fa-building',
          name: 'Company'
        },
        {
          icon: 'fal fa-gamepad',
          name: 'Game'
        },
        {
          icon: 'fal fa-icons',
          name: 'Emoji'
        },
        {
          icon: 'fal fa-robot',
          name: 'Bot List'
        },
        {
          icon: 'fal fa-server',
          name: 'Server List'
        },
        {
          icon: 'fal fa-flag',
          name: 'India'
        },
        {
          icon: 'fab fa-discord',
          name: 'Support'
        },
        {
          icon: 'fal fa-volume',
          name: 'Sound'
        },
        {
          icon: 'fal fa-comments',
          name: 'Chatting'
        },
        {
          icon: 'fal fa-lips',
          name: 'NSFW'
        },
        {
          icon: "fal fa-comment-slash",
          name: "Challange"
        },
        {
          icon: "fal fa-hand-rock",
          name: "Protest"
        },
        {
          icon: "fal fa-headphones-alt",
          name: "Roleplay"
        },
        {
          icon: "fal fa-grin-alt",
          name: "Meme"
        },
        {
          icon: "fal fa-shopping-cart",
          name: "Shop"
        },
        {
          icon: "fal fa-desktop",
          name: "Technology"
        },
        {
          icon: "fal fa-laugh",
          name: "Fun"
        },
        {
          icon: "fal fa-share-alt",
          name: "Social"
        },
        {
          icon: "fal fa-laptop",
          name: "E-Spor"
        },
        {
          icon: 'fal fa-palette',
          name: 'Design'
        },
        {
          icon: 'fal fa-users',
          name: 'Community'
        }
      ]
    }
  },

  server: {
    id: process.env.serverid,//your server id
    invite: process.env.invite,//your server invite link
    roles: {
      administrator: "954130499314528327",// website admin role id
      moderator: "954130592339984424", // bot reveiwer role id
      profile: {
        sitecreator: "954130316992319559", //site owner's id
        booster: "954130077472399431", // booster role id
        sponsor: "954130137148973098", //sponser role id
        supporter: "954130248465801227", //supporter role id
        partnerRole: "954130310344359946" //partner role id
      },
      codeshare: {
        javascript: "", //javascript role id
        html: "", //html role id
        substructure: "", //substructure role id
        bdfd: "", // Bot Designer For Discord
        fiveInvite: "",
        tenInvite: "",
        fifteenInvite: "",
        twentyInvite: ""
      },
      botlist: {
        developer: "954131345586659412", //developer role id
        certified_developer: "954131496950718494", //certified developer role id
        bot: "954131778208149585", //bot role id
        certified_bot: "954131963386675240", // certified bot role id
        bug: "957240135114715226", //bug hunter role id
        premium_developer: "954131720507121665", // premium developer role id
        premium_bot: "954131720507121665", // premium bot role id
        staff: "954130666990207016" // staff role id
      }
    },
    channels: {
      codelog: "954895242660835378",//codelog channel id
      login: "954895242660835378",//login log channel id
      webstatus: "954895242660835378",// website status channel id
      uptimelog: "954895242660835378", //uptime link logs channel id
      botlog: "954895242660835378", //bot add, approve, decline, edit log channel id
      downtimelog: "954895242660835378",//bots downtime log channel id
      votes: "954895242660835378"//votes log channel id
    }
  }


}