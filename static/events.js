var socket = io.connect('http://localhost')

$('#loading').fadeIn(1000);

var populateBody = function(html) {
  var el = $('#body')
  var fadeOut = function(cb){ el.fadeOut(500, cb) }
  var fill = function(cb){ return function(){ el.html(html); cb() }}
  var fadeIn = function(cb){ el.fadeIn(500, (cb || function(){})) }
  fadeOut(fill(fadeIn))
}

socket.on('initial torrent list', function(torrents){
  var html = ich.torrentList({torrent: torrents})
  console.dir(torrents)
  populateBody(html);
})