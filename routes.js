const Router = require('koa-router');

module.exports = function () {
    const router = new Router();

    router
        .get('/news')
        .post('/news')
        .put('/news/:id')
        .delete('/news/:id');

}