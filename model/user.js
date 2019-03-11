const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    username: String
}, {
    versionKey: false
});

module.exports = mongoose.model('User', schema)