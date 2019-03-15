const modelNews = require('../model/News');
const mongoose = require('mongoose');

//Объект news

const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    getAll,
    insertOne,
    updateOne,
    deleteOne
}

async function getAll(ctx) {
    try {
        ctx.body = await modelNews.find();
        ctx.status = 200;
    } catch (err) {
        ctx.status = 404;
        console.log(err);
    }
}

async function insertOne(ctx) {
    const body = ctx.request.body;

    if (!body.header || !body.text) {
        ctx.status = 400;
        ctx.body = {
            error: 'expected an object with header, text: ' + body
        }
        return;
    }

    try {
        const news = await new modelNews({
            header: body.header,
            text: body.text,
            userId: new ObjectId(ctx.state.user.id)
        }).save();

        ctx.body = {
            newsId: news._id
        };
        ctx.status = 201;
    } catch (err) {
        ctx.status = 500;
        console.log(err);
    }
}

async function updateOne(ctx) {
    try {
        await modelNews.findByIdAndUpdate(ctx.params.id, ctx.request.body).orFail();
        ctx.status = 200;
    } catch (err) {
        ctx.status = 500;
        console.log(err);
    }
}

async function deleteOne(ctx) {
    try {
        await modelNews.findByIdAndDelete(ctx.params.id).orFail();
        ctx.status = 202;
    } catch (err) {
        ctx.status = 500;
        console.log(err);
    }
}

