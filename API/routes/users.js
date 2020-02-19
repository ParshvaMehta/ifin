'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
	username: String,
	password: String, //hash created from password
	email: String,
	created_at: {type: Date, default: Date.now},
	user_role: {type: Number, default: 1},
	status: {type: Number, default: 1},
	avatar: {type: String, default: "default-user.png"}
});
var User = mongoose.model('User', userSchema);

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource parshva');
});

router.route('/add').put((req, res) => {
	const data = req.body;
	if (!data.username || !data.email || !data.password) {
		return res.sendStatus(400).json({'code': 400, 'message': 'require parameter missing!'});
	}
	const user = new User({
		username: data.username,
		password: data.password,
		email: data.email
	});
	user.save((err, res) => {
		if (err) {
			return res.send({'code': 500});
		}
		console.log(err);
		console.log(res);
		return res.send({'code': 200});
	}).catch((error) => {
		console.log(error);
		return res.send([{'error': error}]);
	});
});

module.exports = router;
