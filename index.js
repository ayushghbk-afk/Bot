const mineflayer = require("mineflayer");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Bot Online");
});

app.listen(process.env.PORT || 3000);

function createBot() {

    const bot = mineflayer.createBot({
        host: "Ragebaitrebels.aternos.me",
        port: 56690,
        username: "AFKBot",
        auth: "offline"
    });

    bot.on("login", () => {
        console.log("Joined!");

        setInterval(() => {

            bot.setControlState("jump", true);

            setTimeout(() => {
                bot.setControlState("jump", false);
            }, 500);

        }, 30000);
    });

    bot.on("end", () => {
        console.log("Disconnected");
        setTimeout(createBot, 5000);
    });

    bot.on("error", (err) => {
        console.log(err.message);
    });
}

createBot();
