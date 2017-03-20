var express = require('express');

var app = express();

app.get('/', function (req, res) {
  var proxy = app.get('trust proxy');
  if (proxy) {
    return res.send(req.ips);
  } else {
    return res.send(req.ip);
  }
});

app.set('port', 4444);
app.listen(app.get('port'));
