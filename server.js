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
var sessions = require('express-session');
var cookieParser = require('cookie-parser');


var todos = [];
var todoNextId = 1;
var session; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(sessions({
	secret: '&*^*&^@*&#*@^&)(((9803912309',
	resave: false,
	saveUninitialized: true
}))

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

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

//POST /login
app.post('/login', function (req, res) {

	var body = _.pick(req.body, 'email', 'password');
	var userInstance;
	session = req.session;

	db.user.authenticate(body).then(function (user) {
		var token = user.generateToken('authentication');
		userInstance = user;

		return db.token.create({
			token: token
		});

	}).then(function (tokenInstance) {

		session.id = tokenInstance.get('id');
		session.tokenHash = tokenInstance.get('tokenHash');
		session.token = tokenInstance.get('token');
		// console.log(session.tokenHash);
		// console.log(session.token);
		res.cookie('Sourci Sesssion ID', session.id);
		res.redirect('/app/dashboard.html');

	}).catch(function (e) {
		console.log(e);
		res.status(401).send();
	});

});

//DELETE /users/login
app.post('/logout', middleware.requireAuthentication, function (req, res) {

	// req.token.destroy(function (error) {
	// 	console.log(error);
	// })

	req.token.destroy().then(function () {
		res.status(204).send();
	}).catch(function () {
		res.status(500).send();
	});
	res.redirect('/');

});


db.sequelize.sync(
	// {force: true}
	).then(function () {
	app.listen(PORT, function () {
	console.log('Server started on port: ' + PORT);
	});
});

