const mineflayer = require("mineflayer");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Bot Running");
});

app.listen(process.env.PORT || 3000);

function startBot() {

    console.log("Creating bot...");

    const bot = mineflayer.createBot({
        host: "Ragebaitrebels.aternos.me",
        port: 56690,
        username: "AFKBot",
        auth: "offline",
        version: "1.21.4"
    });

    bot.on("connect", () => {
        console.log("TCP Connected");
    });

    bot.on("login", () => {
        console.log("Logged in!");
    });

    bot.on("spawn", () => {
        console.log("Spawned in world!");
    });

    bot.on("messagestr", (msg) => {
        console.log("[CHAT]", msg);
    });

    bot.on("kicked", (reason) => {
        console.log("KICKED:");
        console.log(reason);
    });

    bot.on("end", () => {
        console.log("Connection ended");

        setTimeout(() => {
            startBot();
        }, 10000);
    });

    bot.on("error", (err) => {
        console.log("ERROR:");
        console.log(err);
    });
}

startBot();
