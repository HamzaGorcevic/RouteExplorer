const express = require("express");
const ping = require("ping");
const { exec } = require("child_process");

const app = express();
const port = 8080;

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
        timeout: 20, // Timeout in seconds
    };

    try {
        const resultLatency = await ping.promise.probe(host, options);
        res.json(resultLatency);
    } catch (error) {
        res.status(500).json({ error: "Error during traceroute" });
    }
});
app.get("/traceroute", async (req, res) => {
    const host = req.query.url;
    console.log(host);
    try {
        const hops = await getListOfHops(host);
        res.json(hops);
    } catch (error) {
        res.status(500).json({ errog: "error" });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
