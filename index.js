const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Bot Online");
});

app.listen(process.env.PORT || 3000);

const bedrock = require("bedrock-protocol");

function startBot() {

    const client = bedrock.createClient({
        host: "Ragebaitrebels.aternos.me",
        port: 56690,
        username: "AFKBot",
        offline: true
    });

    client.on("join", () => {
        console.log("Joined!");

        setInterval(() => {
            console.log("Still connected");
        }, 60000);
    });

    client.on("close", () => {
        console.log("Disconnected");
        setTimeout(startBot, 5000);
    });

    client.on("error", (err) => {
        console.log(err.message);
    });
}

startBot();
