'use strict';

var optionData = require('./config');
var express = require('express');
var app = express();

var port_num = 3333;

app.get('/', function (req, res) {
//  res.send(optionData.a);
  res.sendfile('index.html');
});

app.get('/name/:name', function (req, res) {
//  res.sendfile("name.html");
  res.send(req.params.name);
});

app.get('/name', function (req, res) {
  if (req.param('name'))
    res.redirect('/name/' + req.param('name'));
  else
    res.redirect('/');
});

var server = app.listen(port_num, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});

