const mineflayer = require("mineflayer");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const autoeat = require("mineflayer-auto-eat").plugin;
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Ultimate AFK Bot Running");
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
        version: false
    });

    // Plugins
    bot.loadPlugin(pathfinder);
    bot.loadPlugin(autoeat);

    bot.once("spawn", async () => {

        console.log("Bot Spawned!");

        // Auto Eat
        bot.autoeat.options = {
            priority: "foodPoints",
            startAt: 14,
            bannedFood: []
        };

        console.log("AutoEat Enabled");

        // Random movement
        setInterval(() => {

            const actions = [
                "forward",
                "back",
                "left",
                "right"
            ];

            const action = actions[random(0, actions.length - 1)];

            bot.setControlState(action, true);

            setTimeout(() => {
                bot.setControlState(action, false);
            }, random(1000, 3000));

            // Jump
            bot.setControlState("jump", true);

            setTimeout(() => {
                bot.setControlState("jump", false);
            }, 500);

            console.log("Moving:", action);

        }, random(20000, 40000));

        // Random look around
        setInterval(() => {

            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5);

            bot.look(yaw, pitch, true);

            console.log("Looking around");

        }, random(10000, 25000));

        // Auto sleep
        setInterval(async () => {

            try {

                if (bot.time.isNight) {

                    const bed = bot.findBlock({
                        matching: block => bot.isABed(block)
                    });

                    if (bed) {

                        console.log("Found bed");

                        await bot.sleep(bed);

                        console.log("Sleeping");
                    }
                }

            } catch (err) {
                console.log("Sleep Error:", err.message);
            }

        }, 60000);

    });

    // Wake up
    bot.on("wake", () => {
        console.log("Woke up");
    });

    // Chat commands
    bot.on("chat", (username, message) => {

        if (username === bot.username) return;

        if (message === "come") {

            const player = bot.players[username];

            if (!player || !player.entity) return;

            const mcData = require("minecraft-data")(bot.version);

            const movements = new Movements(bot, mcData);

            bot.pathfinder.setMovements(movements);

            bot.pathfinder.setGoal(
                new goals.GoalNear(
                    player.entity.position.x,
                    player.entity.position.y,
                    player.entity.position.z,
                    1
                )
            );

            bot.chat("Coming");
        }

        if (message === "jump") {

            bot.setControlState("jump", true);

            setTimeout(() => {
                bot.setControlState("jump", false);
            }, 1000);
        }

        if (message === "sit") {
            bot.clearControlStates();
            bot.chat("Okay");
        }
    });

    // Logs
    bot.on("messagestr", (msg) => {
        console.log("[CHAT]", msg);
    });

    bot.on("kicked", (reason) => {
        console.log("Kicked:", reason);
    });

    bot.on("error", (err) => {
        console.log("Error:", err.message);
    });

    // Auto reconnect
    bot.on("end", () => {

        console.log("Disconnected");

        setTimeout(() => {

            console.log("Reconnecting...");
            startBot();

        }, 10000);
    });
}

startBot();
