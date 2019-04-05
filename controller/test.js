const modelTest = require('../model/Test');
const mongoose = require('mongoose');

//Объект news

const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    get,
    insert
}

async function get(ctx) {
    try {
        const param = ctx.params;
        let test = await modelTest.findById(param.id).populate(["news", "workers.data.wrk"]);
        ctx.assert(test, 404, "order does't exist");
        ctx.status = 200;
        ctx.body = test;
    } catch (err) {
        ctx.status = 404;
        console.log(err);
    }
}


async function insert(ctx) {
    const body = ctx.request.body;

    // if (!body.header || !body.text) {
    //     ctx.status = 400;
    //     ctx.body = {
    //         error: 'expected an object with header, text: ' + body
    //     }
    //     return;
    // }

    try {
        const news = await new modelTest({
            news: new ObjectId(body.news_id),
            workers: {
                has_driver: true,
                loaders_count: 12,
                data: [{
                    wrk: new ObjectId(body.user_id),
                    positions: [{
                        point: 'df',
                        timestamp: 'dfd'
                    }, ],
                    sum: 45
                }, {
                    wrk: new ObjectId(body.user_id2),
                    positions: [{
                        point: 'df',
                        timestamp: 'dfd'
                    }, ],
                    sum: 45
                }]
            }

        }).save();

        ctx.body = {
            news: news
        };
        ctx.status = 201;
    } catch (err) {
        ctx.status = 500;
        console.log(err);
    }
}