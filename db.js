var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		'dialect': 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/user-data.sqlite'
	});
}
var db = {};
console.log('here');
//db.todo = sequelize.import(__dirname + '/model/todo.js');
db.user = sequelize.import(__dirname + '/model/users.js');
// db.token = sequelize.import(__dirname + '/model/token.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;
// db.todo.belongsTo(db.user);
// db.user.hasMany(db.todo);
module.exports = db;