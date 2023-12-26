var ip = "13.15.13.15";
function showImageOfMap(result) {
    console.log("watafak", result);
    mapboxgl.accessToken =
        "pk.eyJ1IjoiaGFtemEzMjQ1IiwiYSI6ImNsbjh6YnNpNTAwY3MycWw1cHYwNXo1N24ifQ.ffBExfXWXnWCoEWIqJzgEg";
    const map = new mapboxgl.Map({
        container: "map",
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: "mapbox://styles/mapbox/streets-v12",
        center: [12.550343, 55.665957],
        zoom: 8,
    });

    console.log("IMPORTANT LOG");
    for (let i = 0; i < result.length; i++) {
        console.log(result);
        console.log(result[i]);
        if (result[i].lat) {
            console.log("JAJa");
            let marker = new mapboxgl.Marker({ color: "black", rotation: 45 })
                .setLngLat([result[i].lat, result[i].long])
                .addTo(map);
        }
    }

    // Create a default Marker and add it to the map.

    // Create a default Marker, colored black, rotated 45 degrees.
    const marker2 = new mapboxgl.Marker({ color: "black", rotation: 45 })
        .setLngLat([12.65147, 55.608166])
        .addTo(map);
}
function showWayOnMap(result) {
    console.log("Called", result);

    const fetchPromises = result.map((item) =>
        fetch(
            `http://api.ipstack.com/${item.ip}?access_key=c4ae05aae3ca08ca484e26f85d2da9b7`
        ).then((response) => response.json())
    );
    let arrayOfLocations = [];

    Promise.all(fetchPromises)
        .then((responses) => {
            for (let i = 0; i < responses.length; i++) {
                let obj = {
                    lat: responses[i].latitude,
                    long: responses[i].longitude,
                };
                arrayOfLocations.push(obj);
            }

            console.log("array of location", arrayOfLocations);
            showImageOfMap(arrayOfLocations);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

let listOfLatencies = [];
let usersHostValue = document.querySelector(".usersHostValue");
document
    .getElementById("measureLatencyBtn")
    .addEventListener("click", function () {
        let curTime = new Date();

        let options = {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        };

        const hostURL = document.querySelector(".usersHostValue").value;
        let formattedTime = curTime.toLocaleTimeString("en-US", options);

        fetch(`/ping?url=${encodeURIComponent(hostURL)}`)
            .then((response) => response.json())
            .then((result) => {
                console.log("coused");
                const latencyResultElement =
                    document.getElementById("latencyResult");

                if (result.resultLatency.alive) {
                    latencyResultElement.textContent = `Host is reachable. Latency: ${result.resultLatency.time} ms`;
                    showWayOnMap(result.list);
                } else {
                    latencyResultElement.textContent = "Host is not reachable";
                }
            })
            .catch((error) => {
                console.error(`Error fetching latency data: ${error.message}`);
            });
    });
