var cryptojs = require('crypto-js');

module.exports = function (db) {
	return {
		requireAuthentication: function (req, res, next) {
			var token = req.session.token || '';
			console.log('3: ' + token);
			console.log('4: ' + req.session.id);

			db.token.findOne({
				where: {
					tokenHash: cryptojs.MD5(token).toString()
				}
			}).then(function (tokenInstance) {
				if (!tokenInstance) {
					throw new Error();
				}

				req.token = tokenInstance;
				console.log(req.token);
				return db.user.findByToken(token);
			}).then(function (user) {
				req.user = user;
				next();
			}).catch(function () {
				res.status(401).send();
			})
		}
	};
};