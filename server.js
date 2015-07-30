var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	spawn = require('child_process').spawn,
	io = require('socket.io')(server);

server.listen(8080);
app.use(express.static('dist'));

app.get('/', function  (req, res) {
	res.sendFile(__dirname + "/index.html");
});

io.on('connection', function (socket) {
	socket.emit('server_started', {
		msg: 'server came online'
	});

	socket.on('request', function (req) {
		console.log('running command:', req);
		var parts = req.msg.split(' ');
		var cmd;
		if (parts.length > 1) {
			cmd = spawn(parts[0], parts.slice(1));
		} else {
			cmd = spawn(parts[0]);
		}

		cmd.on('close', function (code) {
			console.log('finished command', req);
			socket.emit('request_finished', {
				req: req,
				code: code
			});
		});

		cmd.stdout.on('data', function (buf) {
			socket.emit('request_data', {
				req: req,
				data: buf.toString()
			});
		});

		cmd.stderr.on('data', function (buf) {
			socket.emit('request_data', {
				req: req,
				data: buf.toString()
			});
		});
	});

});


