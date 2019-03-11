const News = require('../model/News');

module.exports = {
    async getAll() {
        return News.find();
    },

    async insertOne(header, text, userId) {

        News.create({
            header: header,
            text: text,
            userId: userId
        });

    },

    async updateOne(id, updatedNews) {
        const bol = id == "5c86076cf0a7ab2f4c67f251";
        News.findByIdAndUpdate(id, updatedNews, function (err, user) {
            if (err) return console.log(err);
            console.log("Обновленный объект", user);
        });
    },

    async deleteOne(id) {
        News.findByIdAndDelete(id, (err, res) => {
            console.log(res);
        });
    }
}