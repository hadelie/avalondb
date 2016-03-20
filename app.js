'use strict';

var optionData = require('./config');
var avMysql = require('./avalon_mysql_conf').get();
var avGenre = require('./avalon_genre');

/* Express */
var express = require('express');
var app = express();
var port_num = 3333;

/* MySQL */
var mysql = require('mysql');
var dbClient = mysql.createConnection(avMysql);

/* Socket.io */
var io = require('socket.io');



/* Uncaught Exception Handling */
process.on('uncaughtException', function (err) {
  console.log('uncaughtException 발생!! ('+err+')');
});

/* Middle Ware */
app.use(function (req, res, next) {
  next();
});



/* RestFul */

app.get('/', function (req, res) {
  res.sendfile('html/index.html');
});

app.get('/name/:name', function (req, res) {
//  res.sendfile('html/name.html');
  res.send(req.params.name);
});

app.get('/name', function (req, res) {
  if (req.param('name'))
    res.redirect('/name/' + req.param('name'));
  else
    res.redirect('/');
});

app.get('/view', function (req, res) {
  res.sendfile('html/view.html');
});

app.get('/mysql', function (req, res) {
 
  var query = dbClient.query('select * from BoardGame where GameName like \"%\"', function(err, rows) {
	res.json(rows);	
  });

});

/* Server Start */

var server = app.listen(port_num, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});


/* Socket.io Start */

io = io.listen(server);

io.sockets.on('connection', function (socket) {

  socket.on('req_gamesearch', function(data){

    var word = data.word;
    var fixedWord = '%';

    for (var i=0; i<word.length; i++) {
      fixedWord += word.charAt(i)+'%';
    }

    var result = {}, i = 0;
    var query = dbClient.query('SELECT * FROM BoardGame WHERE GameName LIKE \"'+fixedWord+'\"', function(err, rows) {

      socket.emit('res_gamesearch', rows);
    });
  })
});

