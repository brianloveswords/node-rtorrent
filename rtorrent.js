var xmlrpc = require('xmlrpc')
var client = xmlrpc.createClient({host: 'localhost', port: '80', path: '/RPC2'})

var rtorrent = module.exports = {}

rtorrent.getAll = function(callback) {
  client.methodCall('d.multicall', ['main', 'd.name=', 'd.hash='], function(err, torrents){
    if (err) return callback(err);
    return callback(null, torrents.map(function(t) {
      return {
        name: t[0],
        hash: t[1],
      }
    }))
  })
}
