const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new mongoose.Schema({
    header: String,
    text: String,
    // TODO: remove by id
    userId: String
}, {
    versionKey: false
});

module.exports = mongoose.model('News', schema);