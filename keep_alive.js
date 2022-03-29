var http = require('http');
var request = require('request')

http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(8080);

var agent = new http.Agent({
  keepAlive: true,
  maxSockets: 1,
  keepAliveMsecs: 3000
})
/*
else if (y == "User not found.") {
  */