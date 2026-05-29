const mineflayer = require("mineflayer");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Bot Online");
});

app.listen(process.env.PORT || 3000);

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startBot() {

    console.log("Starting bot...");

    const bot = mineflayer.createBot({
        host: "Ragebaitrebels.aternos.me",
        port: 56690,
        username: "AFKBot",
        auth: "offline",

        // because your server uses ViaVersion
        version: "1.21.4"
    });

    bot.on("login", () => {
        console.log("Connected!");
    });

    bot.on("spawn", () => {

        console.log("Spawned!");

        // Human-like random movement
        setInterval(() => {

            const actions = [
                "forward",
                "back",
                "left",
                "right"
            ];

            const action = actions[random(0, actions.length - 1)];

            console.log("Moving:", action);

            bot.setControlState(action, true);

            // random jump
            if (Math.random() > 0.5) {

                bot.setControlState("jump", true);

                setTimeout(() => {
                    bot.setControlState("jump", false);
                }, 500);
            }

            setTimeout(() => {
                bot.setControlState(action, false);
            }, random(1000, 4000));

        }, random(10000, 25000));

        // Random looking around
        setInterval(() => {

            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5);

            bot.look(yaw, pitch, true);

            console.log("Looking around");

        }, random(5000, 15000));
    });

    bot.on("messagestr", (msg) => {
        console.log(msg);
    });

    bot.on("kicked", (reason) => {
        console.log("Kicked:", reason);
    });

    bot.on("error", (err) => {
        console.log("Error:", err.message);
    });

    bot.on("end", () => {

        console.log("Disconnected");

        setTimeout(() => {

            console.log("Reconnecting...");
            startBot();

        }, 10000);
    });
}

startBot();
