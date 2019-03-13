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
        modelNews.findByIdAndUpdate(id, updNews, (err, res) => {
            if (err) return console.log(err);
            console.log("Обновленный объект", res);
        });
    },

    async deleteOne(id) {
        modelNews.findByIdAndDelete(id, (err, res) => {
            if (err) return console.log(err);
            console.log("Удалённый объект", res);
        });
    }
}