const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({

    news: {
        type: ObjectId,
        ref: "News"
    },

    //Рабочие принявшие заказ
    //loaders: [{ type: ObjectId, ref: "worker" }],
    workers: {
        has_driver: { type: Boolean, default: false },
        loaders_count: { type: Number, default: 0 },
        data: [
            {
                wrk: { type: ObjectId, ref: "User" },
                positions: [
                    {
                        point: { type: String, default: ' asdf' },
                        timestamp: { type: String, default: ' defasdf' }
                    }
                ],
                sum: { type: Number } //сумма которую рабочий получил от заказчика
            }
        ]
    }
});

module.exports = mongoose.model("Test", schema);
