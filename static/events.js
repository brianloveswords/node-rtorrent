var socket = io.connect('http://localhost')

$('#loading').fadeIn(1000)
var populateBody = function(html) {
  var el = $('#main')
  var fadeOut = function(cb){ el.fadeOut(300, cb) }
  var fill = function(cb){ return function(){ el.html(html); cb() }}
  var fadeIn = function(cb){ el.fadeIn(300, (cb || function(){})) }
  fadeOut(fill(fadeIn))
}
var updateBody = function(html) {
  var el = $('#main')
  el.html(html)
}

// drag and drop section
var tgt = document.getElementById('body')
var over = function(e){
  e.stopPropagation()
  e.preventDefault()
  return false
}
var exit = function(e){
  e.stopPropagation()
  e.preventDefault()
  return false
}
var drop = function(e) {
  e.stopPropagation()
  e.preventDefault()
  var files = e.dataTransfer.files
    , reader = new FileReader();
  var cursor = 0;

  reader.onloadend = function(e){
    var data = e.target.result
    socket.emit('add torrent', { data: data })
    if (files[++cursor]) reader.readAsDataURL(files[cursor])
  }

  reader.readAsDataURL(files[cursor]);
  return false
}
tgt.addEventListener('dragenter', over , false)
tgt.addEventListener('dragover', over, false)
tgt.addEventListener('dragexit', exit, false)
tgt.addEventListener('drop', drop, false)

var startTorrent = function(e){
  var el = $(this)
    , hash = el.data('hash')
  socket.emit('start download', {id: hash})
}

socket.on('initial torrent list', function(torrents){
  var html = ich.torrentList({torrent: torrents})
  populateBody(html);
})
socket.on('update torrent list', function(torrents){
  var html = ich.torrentList({torrent: torrents})
  updateBody(html);
})
$('li.torrent-item').live('click', startTorrent)
