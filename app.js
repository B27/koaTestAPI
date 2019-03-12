const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const router = require('./routes');


const mongoose = require('mongoose');
mongoose.Promise = Promise;
//mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/koa_test_api', {
    useNewUrlParser: true
});
mongoose.connection.on('error', console.error);

const app = new Koa();

app
    .use(logger())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000, () => {
    console.log('listening on port 3000')
});

module.exports = app;