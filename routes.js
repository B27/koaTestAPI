const Router = require('koa-router');
const jwt = require('koa-jwt');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const NewsController = require('./controller/news');
const UserController = require('./controller/user');

const secretString = 'secret JWT need jwt';


const router = new Router();

router.use(jwt({
    secret: secretString
}).unless({
    path: ['/login', '/register']
}));

router.get('/news', async (ctx) => {

    try {
        ctx.body = await NewsController.getAll();
        ctx.res.statusCode = 200;
    } catch (err) {
        ctx.res.statusCode = 404;
        console.log(err);
    }

});

router.post('/news', async (ctx) => {
    const body = ctx.request.body;
    

    if (!body.header || !body.text) {
        ctx.status = 400;
        ctx.body = {
            error: 'expected an object with header, text: ' + body
        }
        return;
    }

    try {

        const objectId = await NewsController.insertOne(body.header, body.text, ctx.state.user.id);
        ctx.body = {
            newsId: objectId
        };
        ctx.res.statusCode = 201;

    } catch (err) {
        console.log(err);
    }


});

router.put('/news/:id', async (ctx) => {
    try {

        await NewsController.updateOne(ctx.params.id, ctx.request.body);
        ctx.res.statusCode = 200;

    } catch (err) {
        console.log(err);
    }

});

router.delete('/news/:id', async (ctx) => {
    try {

        await NewsController.deleteOne(ctx.params.id);
        ctx.res.statusCode = 202;

    } catch (err) {
        console.log(err);
    }

});

router.post('/login', async (ctx, next) => {

    const body = ctx.request.body;

    if (!body.username || !body.password) {
        ctx.status = 400;
        ctx.body = {
            error: 'expected an object with username and password: ' + body
        }
        return;
    }

    let user;
    try {
        
        user = await UserController.getByName(body.username);
        ctx.status = 200;

    } catch (err) {
        console.log('Ошибка получения пользователя' + err);
    }

     if (!user) {
      ctx.status = 401;
      ctx.body = {
        error: "bad username"
      }
      return;
    }

    const {
        passwordHash,
      _id: userId
    } = user;

    if (await bcrypt.compare(ctx.request.body.password, passwordHash)) {
      ctx.body = {
        token: jsonwebtoken.sign({
          id: userId,
        }, secretString, { expiresIn: '5m' })
      }
      await next();
    } else {
      ctx.status = 401;
      ctx.body = {
        error: "bad password"
      }
      return;
    }
});

router.post('/register', async (ctx, next) => {
    const body = ctx.request.body;

    if (!body.username || !body.password) {
        ctx.status = 400;
        ctx.body = {
            error: 'expected an object with username and password: ' + body
        }
        return;
    }

    try {
        await UserController.insertOne(body.username, body.password);
        ctx.res.statusCode = 201;
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;