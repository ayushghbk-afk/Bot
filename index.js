const mineflayer = require("mineflayer");
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("AFK Bot Online");
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

    bot.loadPlugin(pathfinder);

    bot.once("spawn", () => {

        console.log("Spawned!");

        // Anti AFK
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
            }, 2000);

            bot.setControlState("jump", true);

            setTimeout(() => {
                bot.setControlState("jump", false);
            }, 500);

        }, 30000);

        // Look around
        setInterval(() => {

            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5);

            bot.look(yaw, pitch, true);

        }, 15000);

        // Auto sleep
        setInterval(async () => {

            try {

                if (bot.time.isNight) {

                    const bed = bot.findBlock({
                        matching: block => bot.isABed(block)
                    });

                    if (bed) {

                        console.log("Sleeping...");

                        await bot.sleep(bed);
                    }
                }

            } catch (err) {
                console.log(err.message);
            }

        }, 60000);
    });

    // Simple auto eat without plugin
    bot.on("health", async () => {

        try {

            if (bot.food < 15) {

                const food = bot.inventory.items().find(item =>
                    item.name.includes("bread") ||
                    item.name.includes("beef") ||
                    item.name.includes("apple")
                );

                if (food) {

                    await bot.equip(food, "hand");
                    await bot.consume();

                    console.log("Eating food");
                }
            }

        } catch (err) {
            console.log("Eat error:", err.message);
        }
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
    });

    bot.on("messagestr", console.log);
    bot.on("kicked", console.log);
    bot.on("error", console.log);

    bot.on("end", () => {

        console.log("Disconnected");

        setTimeout(() => {
            startBot();
        }, 10000);
    });
}

startBot();
