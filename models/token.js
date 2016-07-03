var cryptojs = require('crypto-js');

module.exports = function (sequelize, DataTypes) {

	return sequelize.define('token', {
		tokenHash: DataTypes.STRING,
		token: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1]
			},
			set: function (value) {
				var hash = cryptojs.MD5(value).toString();

				this.setDataValue('token', value);
				this.setDataValue('tokenHash', hash);
			}
		}
	});
};