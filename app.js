var http = require('http');
var fs = require('fs');
const mqtt = require('mqtt')

var sockets=[]
// SOCKET
// Loading socket.io
// Loading the index file . html displayed to the client
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
    //sockets.push(socket)
    socket.on('message', function (message) {
      console.log('A client is speaking to me! They’re saying: ' + message);
    }); 
});


// MQTT
const client = mqtt.connect('mqtt://broker.hivemq.com')
client.on('connect', () => {
  client.subscribe('restaurant/userid')
})

client.on('message', (topic, message) => {
    
      if (topic == 'restaurant/userid'){
        return handleUserId(message)
    }
    console.log('No handler for topic %s', topic)
  })
  
  function handleUserId(message) {
    console.log('received user id %s', message)
    sockets[0].emit('userid', { content: message});
    };
  


server.listen(8080);

