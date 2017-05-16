var get_ip = require('ipware')().get_ip;
var express = require('express');

var app = express();

app.get('/', function (req, res) {
  var ip_info = get_ip(req);
  return res.send(ip_info.clientIp);
});

app.set('port', 4444);
app.listen(app.get('port'));