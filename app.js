var map = L.map("map").setView([51.505, -0.09], 13); // Replace with your desired initial coordinates and zoom level
var pos = L.GeoIP.getPosition();
L.GeoIP.centerMapOnPosition(map);
L.GeoIP.centerMapOnPosition(map, 15);
var ip = "13.15.13.15";
var zoom = 15;
var pos = L.GeoIP.getPosition(ip);
L.GeoIP.centerMapOnPosition(map, zoom, ip);

// let listOfLatencies = [];
// let usersHostValue = document.querySelector(".usersHostValue");
// document
//     .getElementById("measureLatencyBtn")
//     .addEventListener("click", function () {
//         let curTime = new Date();

//         let options = {
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//             hour12: false,
//         };

//         const hostURL = document.querySelector(".usersHostValue").value;

//         let formattedTime = curTime.toLocaleTimeString("en-US", options);

//         console.log(formattedTime, usersHostValue);

//         // Replace "https://example.com" with the desired host URL

//         // Make an AJAX request to the specified host
//         fetch(`/ping?url=${encodeURIComponent(hostURL)}`)
//             .then((response) => response.json())
//             .then((result) => {
//                 console.log("RESULT!!!", result);
//                 const latencyResultElement =
//                     document.getElementById("latencyResult");

//                 if (result.alive) {
//                     latencyResultElement.textContent = `Host is reachable. Latency: ${result.resultLatency.time} ms`;
//                 } else {
//                     latencyResultElement.textContent = "Host is not reachable";
//                 }
//             })
//             .catch((error) => {
//                 console.error(`Error fetching latency data: ${error.message}`);
//             });
//     });
