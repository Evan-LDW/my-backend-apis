const db = require('./db');

const users = db.addCollection('users');
users.on('insert', function (data) { data.id = data.$loki });

module.exports = users;
