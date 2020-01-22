var http = require('http');
var fs = require('fs');

var socket = null
// SOCKET
// Loading socket.io
// Loading the index file . html displayed to the client
var mqtt = require('mqtt');

var MQTT_TOPIC          = "myTopic";
var MQTT_ADDR           = "mqtt://192.168.1.21";
var MQTT_PORT           = 1883;

/* This works... */
var client  = mqtt.connect(MQTT_ADDR,{clientId: 'bgtestnodejs', protocolId: 'MQIsdp', protocolVersion: 3, connectTimeout:1000, debug:true});

var server = http.createServer(function(req, res) {
  fs.readFile('./index.html', 'utf-8', function(error, content) {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(content);
  });
});

client.on('connect', function () {
  client.subscribe(MQTT_TOPIC);
  //client.publish(MQTT_TOPIC, 'Hello mqtt');
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  console.log('A client is connected!');
  socket.on('message', function (message) {
      console.log('A client is speaking to me! They’re saying: ' + message);
    }); 
});


client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  console.log(message)
  io.sockets.emit('userid',{'topic':String(message.toString())});
});
 



server.listen(8080);

