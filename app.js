var http = require('http');
var fs = require('fs');

var sockets=[]
// SOCKET
// Loading socket.io
// Loading the index file . html displayed to the client
var mqtt = require('mqtt');

var MQTT_TOPIC          = "myTopic";
var MQTT_ADDR           = "mqtt://192.168.1.21";
var MQTT_PORT           = 1883;

/* This is not working as expected */
//var client = mqtt.connect({host: MQTT_ADDR, port:MQTT_PORT},{clientId: 'bgtestnodejs'});

/* This works... */
var client  = mqtt.connect(MQTT_ADDR,{clientId: 'bgtestnodejs', protocolId: 'MQIsdp', protocolVersion: 3, connectTimeout:1000, debug:true});

client.on('connect', function () {
    client.subscribe(MQTT_TOPIC);
    //client.publish(MQTT_TOPIC, 'Hello mqtt');
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
});

client.on('error', function(){
    console.log("ERROR")
    client.end()
})

var server = http.createServer(function(req, res) {
  fs.readFile('./index.html', 'utf-8', function(error, content) {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(content);
  });
});


var io = require('socket.io').listen(server);

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
    console.log('A client is connected!');
    sockets.push(socket)
    socket.on('message', function (message) {
      console.log('A client is speaking to me! They’re saying: ' + message);
    }); 
});


// MQTT
server.listen(8080);

