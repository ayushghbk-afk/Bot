const mineflayer = require("mineflayer");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Bot Running");
});

app.listen(process.env.PORT || 3000);

function startBot() {

    const bot = mineflayer.createBot({
        host: "Ragebaitrebels.aternos.me",
        port: 56690,
        username: "AFKBot",
        auth: "offline",
        version: false
    });

    bot.on("login", () => {
        console.log("Connected!");
    });

    bot.on("spawn", () => {
        console.log("Spawned!");

        setInterval(() => {

            bot.setControlState("jump", true);

            setTimeout(() => {
                bot.setControlState("jump", false);
            }, 500);

        }, 30000);
    });

    bot.on("messagestr", (msg) => {
        console.log(msg);
    });

    bot.on("kicked", console.log);
    bot.on("error", console.log);

    bot.on("end", () => {
        console.log("Reconnecting...");
        setTimeout(startBot, 10000);
    });
}

startBot();
