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
  var how = 'initial'
  var emitTorrentList = function(callback){
    rtorrent.getAll(function(err, torrents){
      socket.emit(how + ' torrent list', torrents)
      how = 'update'
      callback()
    })
  }

  socket.on('add torrent', function(data) {
    var raw = Buffer(data.data.split('base64,')[1], 'base64')
    rtorrent.addNewRaw(raw, function(err, val){})
  })

  socket.on('start download', function(data) {
    rtorrent.startDownload(data.id, function(err, val){
      console.dir(val)
      socket.emit('update state', {id: data.id})
    })
  })

  var continueEmitting = function(){
    setTimeout(function(){
      emitTorrentList(continueEmitting);
    }, 1000)
  }
  continueEmitting()
})

console.log('starting on port 8000')
app.listen(8000)