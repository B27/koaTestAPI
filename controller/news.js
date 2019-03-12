const modelNews = require('../model/News');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    async getAll() {
        return modelNews.find();
    },

    async insertOne(head, txt, usrId) {

        modelNews.create({
            header: head,
            text: txt,
            userId: new ObjectId(usrId)
        });

    },

    async updateOne(id, updNews) {
        modelNews.findByIdAndUpdate(id, updNews, (err, res) => {
            if (err) return console.log(err);
            console.log("Обновленный объект", user);
        });
    },

    async deleteOne(id) {
        modelNews.findByIdAndDelete(id, (err, res) => {
            if (err) return console.log(err);
            console.log("Удалённый объект", res);
        });
    }
}