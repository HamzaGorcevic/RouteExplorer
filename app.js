mapboxgl.accessToken =
    "pk.eyJ1IjoiaGFtemEzMjQ1IiwiYSI6ImNsbjh6YnNpNTAwY3MycWw1cHYwNXo1N24ifQ.ffBExfXWXnWCoEWIqJzgEg";
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    zoom: 2,
    center: [43.158157, 20.346822], // Center the map on the starting point
});

function showImageOfMap(result) {
    console.log("watafak", result);

    // Split the location string into latitude and longitude
    let coordinates = [];

    for (let i = 0; i < result.length; i++) {
        if (result[i].loc) {
            const [lat, lon] = result[i].loc.split(",");
            let temp = [lon, lat];
            coordinates.push(temp);

            let marker = new mapboxgl.Marker({ color: "black", rotation: 45 })
                .setLngLat([lon, lat])
                .addTo(map);
        }
    }

    // Check if there are at least two coordinates to create a line
    if (coordinates.length >= 2) {
        console.log("coord", coordinates);
        const geojson = {
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: coordinates,
            },
        };

        // Add the line to the map outside the loop
        map.addLayer({
            id: "line",
            type: "line",
            source: {
                type: "geojson",
                data: geojson,
            },
            paint: {
                "line-color": "#86A7FC",
                "line-width": 10,
            },
        });
    }
}

async function showWayOnMap(result) {
    const ipInfoToken = "218ef8019d85f5";
    console.log("Called", result);

    try {
        const responses = await Promise.all(
            result.map((item) =>
                fetch(`https://ipinfo.io/${item.ip}?token=${ipInfoToken}`).then(
                    (response) => response.json()
                )
            )
        );

        showImageOfMap(responses);
    } catch (error) {
        console.error("Error fetching IP information:", error);
    }
}

let listOfLatencies = [];
let usersHostValue = document.querySelector(".usersHostValue");

document
    .getElementById("measureLatencyBtn")
    .addEventListener("click", async function () {
        let curTime = new Date();

        let options = {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        };

        const hostURL = document.querySelector(".usersHostValue").value;
        let formattedTime = curTime.toLocaleTimeString("en-US", options);

        try {
            const result = await fetch(
                `/traceroute?url=${encodeURIComponent(hostURL)}`
            ).then((response) => response.json());

            console.log(result);
            await showWayOnMap(result);
        } catch (error) {
            console.error("Error fetching traceroute data:", error);
        }
    });
