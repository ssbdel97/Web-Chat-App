var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
var db = require('./db.js');
var _ = require('underscore');
var bcrypt = require('bcrypt');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var urlencodedParser = bodyParser.urlencoded({
	extended: true
});
querystring = require('querystring');
app.use(express.static(__dirname + '/public'));
var clientInfo = {};
//sends current users to provided sockets
function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id];
	var users = [];
	if (typeof info === 'undefined') {
		return;
	}
	Object.keys(clientInfo).forEach(function(socketId) {
		var userInfo = clientInfo[socketId];
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});
	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}
io.on('connection', function(socket) {
	console.log('User connected via socket.io');

	socket.on('disconnect', function() {
		var userData = clientInfo[socket.id];
		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left',
				timestamp: moment().valueOf()
			});

			db.user.destroy({
				where: {
					name: userData.name
				}
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()

		});
	});

	socket.on('message', function(message) {
		console.log('Message recieved: ', message.text);
		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
		}
	});
	var now = moment();
	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application!',
		timestamp: moment().valueOf()
	});
});
app.post('/users', urlencodedParser, function(req, res) {
	var body = _.pick(req.body, 'name');
	console.log(body);
	db.user.authenticate(body).then(function(user) {
		console.log('user');
		if (!user) {
			return body;
		}
		//console.log('to home');
		return;
		// res.redirect('/');
		// console.log('testing');
		// res.status(200).send();
		// console.log('testing...');
	}).then(function(body) {
		if (body)
			return db.user.create(body);
		return;
	}).then(function(user) {
		if (user) {

			console.log('Name inserted');
			query = querystring.stringify({
				"name": body.name,
				"room": req.body.room
			});
			res.redirect('./chat.html?' + query);
		} else {
			console.log('to home');
			res.redirect('/');
		}
	}).catch(function() {
		console.log('error!');
		res.status(401).send();
	});
});
db.sequelize.sync({
	//force: true
}).then(function() {
	http.listen(PORT, function() {
		console.log('Server started!!');
	})
});