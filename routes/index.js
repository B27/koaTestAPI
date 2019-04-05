const Router = require('koa-router');
const jwt = require('koa-jwt');

const secretString = 'secret JWT need jwt';

const NewsController = require('../controller/news');
const UserController = require('../controller/user');
const TestController = require('../controller/test');


const router = new Router();

router.use(jwt({
    secret: secretString
}).unless({
    path: ['/login', '/register', '/test', 'test/:id']
}));

router
    .get('/test/:id', TestController.get)
    .post('/test', TestController.insert)

    .get('/news', NewsController.getAll)
    .post('/news', NewsController.insertOne)
    .put('/news/:id', NewsController.updateOne)
    .delete('/news/:id', NewsController.deleteOne);

router
    .post('/login', UserController.checkThenReturnToken)
    .post('/register', UserController.toRegister);


module.exports = router;