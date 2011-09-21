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
  var emitTorrentList = function(){
    rtorrent.getAll(function(err, torrents){
      socket.emit('initial torrent list', torrents)
    })
  }

  socket.on('add torrent', function(data) {
    var raw = Buffer(data.data.split('base64,')[1], 'base64')
    rtorrent.addNewRaw(raw, function(err, val){
      console.dir(val)
      emitTorrentList()
    })
  })

  socket.on('start download', function(data) {
    rtorrent.startDownload(data.id, function(err, val){
      console.dir(val)
      socket.emit('update state', {id: data.id})
    })
  })

  emitTorrentList();
})

console.log('starting on port 8000')
app.listen(8000)