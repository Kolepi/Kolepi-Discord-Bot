const {
    Client
} = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');
const fetch = require("node-fetch")

dotenv.config();

const bot = new Client();

var cryptomonnaies = {};

setInterval(() => {
    getValue("bitcoin", "usd");
    getValue("ethereum", "usd");
    getValue("binancecoin", "usd");
    getValue("cardano", "usd");
    getValue("dogecoin", "usd");
    getValue("polkadot", "usd");
    getValue("uniswap", "usd");
    getValue("solana", "usd");
    getValue("chainlink", "usd");
    getValue("pancakeswap-token", "usd");
}, 2000)

bot.login("");

bot.on('ready', () => {
    console.log(`${bot.user.username} est fonctionnel!`);
});


// Statuses

function displayPrice(ids, devise) {
    return (cryptomonnaies && cryptomonnaies[ids] && cryptomonnaies[ids][devise]) ? cryptomonnaies[ids][devise] + "" : "";
}

function getValue(ids, devise) {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids="+ ids + "&vs_currencies="+ devise)
        .then((response) => response.json())
        .then((value) => {
            cryptomonnaies[ids] = {};
            cryptomonnaies[ids][devise] = value[ids][devise];
        })
        .catch((err) => console.error)
    }

bot.on("ready", () => {
    const statuses = [
        () => "BTC = " + displayPrice("bitcoin", "usd") + "$",
        () => "ETH = " + displayPrice("ethereum", "usd") + "$",
        () => "BNB = " + displayPrice("binancecoin", "usd") + "$",
        () => "ADA = " + displayPrice("cardano", "usd") + "$",
        () => "DOGE = " + displayPrice("dogecoin", "usd") + "$",
        () => "DOT = " + displayPrice("polkadot", "usd") + "$",
        () => "UNI = " + displayPrice("uniswap", "usd") + "$",
        () => "SOL = " + displayPrice("solana", "usd") + "$",
        () => "LINK = " + displayPrice("chainlink", "usd") + "$",
        () => "CAKE = " + displayPrice("pancakeswap-token", "usd") + "$",
    ]
    let i = 0
    setInterval(() => {
        bot.user.setActivity(statuses[i](), {type: "WATCHING"})
        i = ++i % statuses.length
    }, 1e4)
})


// Commandes
bot.on('message', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!ping')) {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`La latence est de ${timeTaken}ms.`)
    }

    if (message.content.startsWith('!price')) {
        const [command, ...args] = message.content.split(' ');

        if (args.length !== 2) {
            return message.reply(
                `J'ai besoin d'une crypto et d'une devise à laquelle la comparer !`
            );
        } else {
            const [coin, vsCurrency] = args;
            try {
                const {
                    data
                } = await axios.get(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vsCurrency}`
                );

                if (!data[coin][vsCurrency]) throw Error();

                return message.reply(
                    `Le prix actuel d'1 ${coin} est ${data[coin][vsCurrency]} ${vsCurrency}`
                );
            } catch (err) {
                return message.reply(
                    'Vérifie ce que tu as entrée ! Exemple : !price bitcoin usd'
                );
            }
        }
    }


    if (message.content.startsWith("!stats")) {
        return message.reply
            ({ embed: {
                color: "RANDOM",
                title: "Statistiques de Kryptolepi",
                url: "https://twitter.com/kryptolepi",
                fields: [{
                    name: "Channels",
                    value: `${bot.channels.cache.size}`
                  },
                  {
                    name: "Servers",
                    value: `${bot.guilds.cache.size}`
                  },
                  {
                    name: "Users",
                    value: `${bot.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`
                  }
                ],
                footer: {
                  icon_url: bot.user.displayAvatarURL(),
                  text: "© Kryptolepi"
                }
              }
            }
        )}

        if (message.content.startsWith("!help")) {
            message.channel.send({
                embed: {
                    color: "RANDOM",
                    title: "help",
                    description: "Voila toutes les commandes que je connais !",
                    fields: [{
                            name: "!ping",
                            value: "Renvoie le temps de réponse du bot."
                        },
                        {
                            name: "!help",
                            value: "Renvoie les commandes disponibles."
                        },
                        {
                            name: "!price <id d'une crypto> + <devise>",
                            value: "Renvoie le prix d'une crypto."
                        },
                        {
                            name: "!stats",
                            value: "Statistiques de Kryptolepi."
                        }
                    ],
                    footer: {
                        icon_url: bot.user.displayAvatarURL(),
                        text: "© Kryptolepi"
                      }
                }
            });
        }
    });