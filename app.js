mapboxgl.accessToken =
    "pk.eyJ1IjoiaGFtemEzMjQ1IiwiYSI6ImNsbjh6YnNpNTAwY3MycWw1cHYwNXo1N24ifQ.ffBExfXWXnWCoEWIqJzgEg";
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    zoom: 8,
});

function showImageOfMap(result) {
    console.log("watafak", result);

    // Split the location string into latitude and longitude
    if (result.loc) {
        const [lat, lon] = result.loc.split(",");
        console.log("lon:", lat, lon);
        let marker = new mapboxgl.Marker({ color: "black", rotation: 45 })
            .setLngLat([lon, lat])
            .addTo(map);
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

        responses.forEach((response) => showImageOfMap(response));
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
