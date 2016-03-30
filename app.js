'use strict';

var optionData = require('./conf/config');
var avAdmin = require('./conf/avalon_admin_conf').get();
var avMysql = require('./conf/avalon_mysql_conf').get();
var avGenre = require('./conf/avalon_genre');


/* Express */
var express = require('express');
var session = require('express-session')({
	secret: '_secret_of_avalon_', cookie: { maxAge: 60000 }
});

var app = express();
var port_num = 3333;
var sendFileOption = { root: __dirname + '/html/' }

/* MySQL */
var mysql = require('mysql');
var dbClient = mysql.createConnection(avMysql);

/* Socket.io */
var io = require('socket.io');
var sharedsession = require('express-socket.io-session');

/* Uncaught Exception Handling */
process.on('uncaughtException', function (err) {
  console.log('uncaughtException 발생!! ('+err+')');
});

/* MiddleWare */

app.use(session);

app.use('/static', express.static(__dirname + '/static'));
app.use(function (req, res, next) {
  req.session.admin_token = 0;
  next();
});



/* RestFul */

app.get('/', function (req, res) {
//  res.sendFile('index.html', sendFileOption);
  res.redirect('/search');
});

app.get('/search', function (req, res) {
  res.sendFile('search.html', sendFileOption);
});

app.get('/register', function (req, res) {
  res.sendFile('register.html', sendFileOption);
});



/* Server Start */

var server = app.listen(port_num, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});



/* GAME ID GENERATOR */

//INPUT: OWNER and GENRE like ('A1')
//OUTPUT: ID like ('A1005')
var genId = function (OG) {
	dbClient.query('SELECT COUNT(GameIndex) FROM BoardGame WHERE GameIndex LIKE "'+ OG +'%"', function (err, row) {
		var _cnt = row[0]["COUNT(GameIndex)"];
		
		if (_cnt < 10)
			return OG+'00'+_cnt;
		else if (_cnt < 100)
			return OG+'0'+_cnt;
		else
			return OG+_cnt;
	})
}

/* Socket.io Start */

io = io.listen(server);
io.use(sharedsession(session));

io.sockets.on('connection', function (socket) {

	socket.on('req_gamesearch', function(data){

		var query = '';

		if (data.id != undefined) {
			var id = data.id;

			console.log('search by ID : '+id);
			dbClient.query('INSERT INTO BGSearchHistory (search_field, search_keyword, date) VALUES ("ID", "'+id+'", DATE_ADD(now(), INTERVAL 9 HOUR))');

			query = 'SELECT * FROM BoardGame WHERE GameIndex LIKE \"%'+id+'%\"';

		} else if (data.word != undefined) {
			var word = data.word;
			var fixedWord = '%';

			console.log('search by NAME : '+word);
			dbClient.query('INSERT INTO BGSearchHistory (search_field, search_keyword, date) VALUES ("NAME", "'+word+'", DATE_ADD(now(), INTERVAL 9 HOUR))');

			for (var i=0; i<word.length; i++) {
				fixedWord += word.charAt(i)+'%';
			}

			query = 'SELECT * FROM BoardGame WHERE GameName LIKE \"'+fixedWord+'\"';

		} else if (data.genre != undefined && data.genre != 'none') {
			var genre = data.genre;

			console.log('search by Genre : '+avGenre[genre]);
			dbClient.query('INSERT INTO BGSearchHistory (search_field, search_keyword, date) VALUES ("GENRE", "' + avGenre[genre] + '", DATE_ADD(now(), INTERVAL 9 HOUR))');

			if (genre=='all')
				query = 'SELECT * FROM BoardGame';
			else
				query = 'SELECT * FROM BoardGame WHERE GameGenre='+genre;
		}

		if (query) {
			dbClient.query(query, function(err, rows) {
				socket.emit('res_gamesearch', rows);
			});
		}
	});

	socket.on('req_login_admin', function(data){
		if (data.user === avAdmin.user && data.password === avAdmin.password) {
			// 로그인 성공
			socket.handshake.session.admin_token = 1;
			socket.emit('res_login_admin', {loggedIn: true});

		} else {
			// 로그인 실패
			socket.emit('res_login_admin', {loggedIn: false});

		}
	});

	socket.on('req_gameregister', function(data) {
		if (socket.handshake.session.admin_token === 1) {

			if (data.GameName=='') {
				socket.emit('res_gameregister', {registered: false, msg: 'no GameName'});
				return;
			} else if (!(data.GameGenre>='0' && data.GameGenre <= '9')) {
				socket.emit('res_gameregister', {registered: false, msg: 'no GameGenre'});
				return;
			}
	
			if (data.GameOwner === 'AVALON')
				data.GameIndex = 'A';
			else
				data.GameIndex = 'B';

			data.GameIndex += data.GameGenre;

			dbClient.query('SELECT COUNT(GameIndex) FROM BoardGame WHERE GameIndex LIKE "'+ data.GameIndex +'%"', function (err, row) {
				var _cnt = row[0]["COUNT(GameIndex)"];
				
				if (_cnt < 10)
					data.GameIndex += '00' + _cnt;
				else if (_cnt < 100)
					data.GameIndex += '0' + _cnt;
				else
					data.GameIndex += _cnt;

				dbClient.query('INSERT INTO BoardGame (GameIndex, GameGenre, GameName, GameOwner, SubmitDate, GameMemo) VALUES ("'+ data.GameIndex +'", "'+ data.GameGenre +'", "'+ data.GameName +'", "'+ data.GameOwner +'", DATE_ADD(now(), INTERVAL 9 HOUR), "'+ data.GameMemo +'")', function (err, row) {
					
					socket.emit('res_gameregister', {registered: true, data: data});
				});


			})
		} else {
			socket.emit('res_gameregister', {registered: false, msg: 'notLoggedIn'});
		}
	});


});

