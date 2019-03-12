const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const schema = new Schema({
    header: String,
    text: String,
    // TODO: remove by id
    userId: ObjectId
});

module.exports = mongoose.model('News', schema);