// libraries
var express = require('express')
  , socketio = require('socket.io')
  , path = require('path')
  , rtorrent = require('./rtorrent')
// local
  , app = express.createServer()
  , io = socketio.listen(app);

app.use(express.static(path.join(__dirname, "static")))

app.get('/torrents', function(req, res, next){
})

io.sockets.on('connection', function(socket) {
  rtorrent.getAll(function(err, torrents){
    console.log('emitting initial list')
    socket.emit('initial torrent list', torrents)
  })
})

console.log('starting on port 8000')
app.listen(8000)