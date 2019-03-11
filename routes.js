const Router = require('koa-router');
const NewsController = require('./controller/news');


const router = new Router();

router.get('/news', async (ctx) => {
    try {
        ctx.body = await NewsController.getAll();
    } catch (err) {
        ctx.res.statusCode = 404;
        console.log(err);
    }

});

router.post('/news', async (ctx) => {
    const body = ctx.request.body;

    if (!body.header || !body.text || !body.userId) {
        ctx.status = 400;
        ctx.body = {
            error: 'expected an object with header, text, userId: ' + ctx.request.body
        }
        return;
    }

    try {

        await NewsController.insertOne(body.header, body.text, body.userId);
        ctx.res.statusCode = 201;

    } catch (err) {
        console.log(err);
    }


});

router.put('/news/:id', async (ctx) => {
    try {

       await NewsController.updateOne(ctx.params.id, ctx.request.body);

    } catch (err) {
        console.log(err);
    }

});

router.delete('/news/:id', (ctx) => {

});

router.post('/login');

router.post('/register');





module.exports = router;