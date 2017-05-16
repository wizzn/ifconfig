(function () {
  'use strict';
  
  require('dotenv').config();
  var get_ip = require('ipware')().get_ip;
  var app = require('express')();
  
  var http_port = process.env.HTTP_PORT;
  var https_port = process.env.HTTPS_PORT;

  function approveDomains(opts, certs, cb) {
    // This is where you check your database and associated
    // email addresses with domains and agreements and such


    // The domains being approved for the first time are listed in opts.domains
    // Certs being renewed are listed in certs.altnames
    if (certs) {
      opts.domains = certs.altnames;
    }
    else {
      opts.email = 'john.doe@example.com';
      opts.agreeTos = true;
    }

    cb(null, { options: opts, certs: certs });
  }

  var lex = require('greenlock-express').create({
    // set to https://acme-v01.api.letsencrypt.org/directory in production
    server: 'staging',

  challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' }) },
  store: require('le-store-certbot').create({ webrootPath: '/tmp/acme-challenges' }),

  approveDomains: approveDomains
  });

  require('http').createServer(lex.middleware(require('redirect-https')())).listen(http_port, function () {
    console.log("Listening for ACME http-01 challenges on", this.address());
  });

  app.get('/', function (req, res) {
    var ip_info = get_ip(req);
    return res.send(ip_info.clientIp);
  });

  require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(https_port, function () {
    console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
  });

}());
