'use strict';

var optionData = require('./conf/config');
var avMysql = require('./conf/avalon_mysql_conf').get();
var avGenre = require('./conf/avalon_genre');

/* Express */
var express = require('express');
var app = express();
var port_num = 3333;
var sendFileOption = { root: __dirname + '/html/' }

/* MySQL */
var mysql = require('mysql');
var dbClient = mysql.createConnection(avMysql);

/* Socket.io */
var io = require('socket.io');

/* Uncaught Exception Handling */
process.on('uncaughtException', function (err) {
  console.log('uncaughtException 발생!! ('+err+')');
});

/* MiddleWare */
app.use('/static', express.static(__dirname + '/static'));
app.use(function (req, res, next) {

  next();
});



/* RestFul */

app.get('/', function (req, res) {
  res.sendFile('index.html', sendFileOption);
});

app.get('/name/:name', function (req, res) {
  res.send(req.params.name);
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

		var query = '';

		if (data.id != undefined) {
			var id = data.id;

			query = 'SELECT * FROM BoardGame WHERE GameIndex LIKE \"%'+id+'%\"';

		} else if (data.word != undefined) {
			var word = data.word;
			var fixedWord = '%';

			for (var i=0; i<word.length; i++) {
				fixedWord += word.charAt(i)+'%';
			}

			query = 'SELECT * FROM BoardGame WHERE GameName LIKE \"'+fixedWord+'\"';

		} else if (data.genre != undefined && data.genre != 'none') {
			var genre = data.genre;

			if (genre=='all')
				query = 'SELECT * FROM BoardGame';
			else
				query = 'SELECT * FROM BoardGame WHERE GameGener='+genre;
		}

		if (query) {
			dbClient.query(query, function(err, rows) {
				socket.emit('res_gamesearch', rows);
			});
		}


	})
});

