const modelNews = require('../model/News');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    async getAll() {
        return modelNews.find();
    },

    async insertOne(head, txt, usrId) {

        try {
            const news = await new modelNews({
                header: head,
                text: txt,
                userId: new ObjectId(usrId)
            }).save();
            return news._id;
        } catch (err) {
            throw err;
        }

    },

    async updateOne(id, updNews) {
        await modelNews.findByIdAndUpdate(id, updNews).orFail();
    },

    async deleteOne(id) {
        await modelNews.findByIdAndDelete(id).orFail();
    }
}