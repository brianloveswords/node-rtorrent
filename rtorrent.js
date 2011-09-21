var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var xmlrpc = require('xmlrpc')
var client = xmlrpc.createClient({host: 'localhost', port: '80', path: '/RPC2'})

var rtorrent = module.exports = {}

rtorrent.getAll = function(callback) {
  var fields = ['main', 'd.name=', 'd.hash=', 'd.size_bytes=', 'd.bytes_done=']
  client.methodCall('d.multicall', fields, function(err, torrents){
    if (err) return callback(err);
    return callback(null, torrents.map(function(t) {
      var sizes = humanize(t.slice(2, 4))
      return {
        name: t[0],
        hash: t[1],
        total: sizes[0],
        done: sizes[1]
      }
    }))
  })
}

rtorrent.addNewRaw = function(data, callback) {
  var writeFile = function(data, cb){
    var md5 = crypto.createHash('md5')
    var filename = path.join('/tmp', md5.update(data).digest('hex') + '.torrent')
    fs.writeFile(filename, data, function(err){
      if (err) throw err;
      cb(filename)
    })
  }
  var loadTorrentFile = function(cb){
    return function(filename){
      client.methodCall('load', [filename, 'd.start='], function(err, val) {
        if (err) return cb(err);
        cb(null, val);
      })
    }
  }
  writeFile(data, loadTorrentFile(callback))
}

rtorrent.startDownload = function(id, callback){
  client.methodCall('d.start', [id], function(err, val){
    callback(null, id)
  })
}

var humanize = function(arr) {
  var max = 0, factor = 1, suffix ='bytes',
      KB = 1024, MB = KB*1024, GB = MB*1024
  max = Math.max.apply(null, arr);
  if (max >= KB && max < MB) factor = KB, suffix = 'KB'
  else if (max >= MB && max < GB) factor = MB, suffix = 'MB'
  else if (max >= GB) factor = GB, suffix = 'GB'
  return arr.map(function(n){
    var num = ('' + n/factor).replace(/(\d+\.\d{0,2})\d*/, "$1")
    return [num, suffix].join(' ')
  })
}
