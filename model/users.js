var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');
module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
			
		},
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (typeof user.name === 'string') {
					user.name = user.name.toLowerCase();
				}

			}
		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					if (typeof body.name !== 'string'){// || typeof body.password !== 'string') {
						return reject();
					}
					// user.findOne({
					// 	where: {
					// 		name: body.name
					// 	}
					// }).then(function(user) {
					// 	resolve(user);
					// }, function(e) {
					// 	reject();
					// });
				});
			}
		}


	});
	return user;
};