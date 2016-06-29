var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db);

var todos = [];
var todoNextId = 1;

app.use(bodyParser());


app.use(express.static(__dirname + '/public'));

//POST /users/
app.post('/register', function (req, res) {

	// console.log(req.body.email);

	var body = _.pick(req.body, 'email', 'password', 'title', 'firstName', 'lastName', 'role',
					'organisation', 'country', 'city', 'action', 'phoneNumber', 'notes');

	console.log(body);

	if (body.action === 'New Organisation') {
		console.log('New Organisation');
	} else if (body.action === 'Add User') {
		console.log('Add User');
	} else {
		res.status(400).json({Error: 'Error'});
	}

	db.user.create(body).then(function (users) {
		res.json(users.toPublicJSON());
	}, function (e) {
		res.status(400).json(e);
	});

});


// app.post('/res', function(req, res){
//   var userName = req.body.userName;
//   var html = 'Hello: ' + userName + '.<br>' +
//              '<a href="/">Try again.</a>';
//   res.send(html);
// });

db.sequelize.sync({force: true}).then(function () {
	app.listen(PORT, function () {
	console.log('Server started on port: ' + PORT);
	});
});

