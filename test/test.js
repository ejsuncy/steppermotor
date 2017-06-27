var mqtt = require("mqtt")
var client = mqtt.connect("ws://localhost:3030");

client.on('connect', function() {
	console.log("connected!");
});

