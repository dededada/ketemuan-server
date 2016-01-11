"use strict"

var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var uuid = require('node-uuid');

var listActiveRoom = {}

class Room {
  constructor(uuid){
    this.uuid=uuid;
    this.user={};
  }
  addUser(id){
    this.user[id] = new User(id);
  }
  removeUser(id){
    delete user[id];
  }
};

class User{
  constructor(id){
    this.id = id;
    this.name = "";
    this.location = {};
    this.location.lat = 0;
    this.location.long = 0;
  }
}

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

app.get('/link', function (req, res){
  var uniqueId = uuid.v1();
  var room = new Room(uniqueId);
  //room.addUser(req.query.id);
  // TODO: user must be unique
  listActiveRoom[uniqueId] = room;
  room.link = 'http://'+req.headers.host+'/room/'+uniqueId;
  res.send(room);
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('join',function(userId, roomId){
      //console.log('join requested by '+userId+' for room '+roomId);
      socket.join(roomId);
      socket.room = roomId;
      socket.id = userId;
      listActiveRoom[roomId].addUser(userId);
      console.log(listActiveRoom);
  });
});

io.on('disconnect', function(socket){
  socket.leave(socket.room);
  listActiveRoom[socket.room].removeUser(socket.id);
  console.log(listActiveRoom);
});

server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})

