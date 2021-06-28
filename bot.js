const {
    Client
} = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const bot = new Client();

bot.login(process.env.DISCORD_BOT_TOKEN);

bot.on('ready', () => {
    console.log(`${bot.user.username} est fonctionnel!`);
});

bot.on("ready", () => {
    const statuses = [
        () => "!ping",
        () => "!help",
        () => "!price"
    ]
    let i = 0
    setInterval(() => {
        bot.user.setActivity(statuses[i](), {type: "WATCHING"})
        i = ++i % statuses.length
    }, 1e4)
})

bot.on('message', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!ping')) {
        return message.reply('Bien reçu!');
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

    if (message.content.startsWith('!help')) {
        return message.reply(
          `Je connais 3 commandes:\n
          !ping - Pour voir si je fonctionne\n
          !price <nom_de_la_crypto> <devise_a_comparer> - Renvoie le prix actuelle de la crypto indiquée vs la devise indiquée\n
          !help - Pour checker les commandes disponibles !`
        );
      }
    });
