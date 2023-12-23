const express = require("express");
const ping = require("ping");
const { exec } = require("child_process");

const app = express();
const port = 8000;

app.use(express.static(__dirname));

const Traceroute = require("nodejs-traceroute");

function getListOfHops(destination) {
    return new Promise((resolve, reject) => {
        const tracer = new Traceroute();
        const hops = [];

        tracer.on("hop", (hop) => {
            console.log(`hop: ${JSON.stringify(hop)}`);
            hops.push(hop);
        });

        tracer.on("close", () => {
            // Traceroute completed, resolve with the array of hops
            resolve(hops);
        });

        tracer.on("error", (err) => {
            reject(err);
        });

        tracer.on("end", () => {
            // Traceroute has ended, resolve with the array of hops
            resolve(hops);
        });

        tracer.trace(destination);
    });
}

app.get("/ping", async (req, res) => {
    const host = req.query.url || "www.novipazar.com";
    console.log("host:", host);
    const options = {
        timeout: 10, // Timeout in seconds
    };

    try {
        const list = await getListOfHops(host);
        const resultLatency = await ping.promise.probe(host, options);
        res.json({ list, resultLatency });
    } catch (error) {
        res.status(500).json({ error: "Error during traceroute" });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
