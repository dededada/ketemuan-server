var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('node-uuid');

var listActiveRoom = []

var Room = function(uuid){
  this.uuid=uuid;
  this.user=[];
};
Room.prototype.addUser = function(id){this.user.push(id)};

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/link', function (req, res){
  var uniqueId = uuid.v1();
  room = new Room(uniqueId);
  room.addUser(req.query.id);
  listActiveRoom.push(room);
  res.send(room);
});

io.on('connection', function(socket){
  console.log('a user connected');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})

