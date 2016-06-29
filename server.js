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


app.use(function(err, req, res, next) {
  //do logging and user-friendly error message display
  res.redirect('/public/500.html');
})

//POST /users/
app.post('/register', function (req, res) {

	var body = _.pick(req.body, 'email', 'password', 'title', 'firstName', 'lastName', 'role',
					'organisation', 'country', 'city', 'action', 'phoneNumber', 'notes');

	db.user.create(body).then(function (users) {
		console.log('User succesfully registred');
		res.redirect('/register.html');
		//res.json(users.toPublicJSON());
	}, function (e) {
		console.log(e.errors.length);
		res.status(400).json(e);
	});

});

//POST /users/login
app.post('/login', function (req, res) {

	var body = _.pick(req.body, 'email', 'password');
	var userInstance;

	db.user.authenticate(body).then(function (user) {
		var token = user.generateToken('authentication');
		//console.log(token);
		userInstance = user;

		return db.token.create({
			token: token
		});

	}).then(function (tokenInstance) {
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function () {
		res.status(401).send();
	});

});


db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
	console.log('Server started on port: ' + PORT);
	});
});

