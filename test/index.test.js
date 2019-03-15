process.env.NODE_ENV = 'test';

//Это тесты котрые нужны нам

const mongoose = require('mongoose');
mongoose.Promise = Promise;
// mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/koa_test_api', {
  useNewUrlParser: true
});
mongoose.connection.on('error', console.error);
const ObjectId = mongoose.Types.ObjectId;

//jwt авторизация

const jwt = require('jsonwebtoken');
const secretString = 'secret JWT need jwt';

const User = require('../model/User');
const News = require('../model/News');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let jsonToken;
let idForNews;
const
  APP = 'localhost:3000',
  HEADER = '~~~~~Заголовок новости~~~~~',
  TEXT = '~~~~Длинный текст который является продолжением заголовка~~~~~',
  NEWHEADER = '~~~%%~~Заголовок новости~~~~~',
  NEWTEXT = '~~%%~~Длинный текст который является продолжением заголовка~~~~~',
  USERNAME = 'testuserwithtestpassword',
  PASSWORD = 'johnson',
  WRONGUSERNAME = 'jery',
  WRONGPASSWORD = 'joson';


describe('Тестирование API', () => {

  after(async function () {
    await User.deleteMany({
      username: USERNAME
    });
    await News.deleteMany({
      header: HEADER,
      text: TEXT
    });
    await News.deleteMany({
      header: NEWHEADER,
      text: NEWTEXT
    });
    mongoose.connection.close();
  });


  describe('Регистрация и вход', () => {
    it('Должен зарегистрировать пользователя и вернуть 201', async () => {
      let response = await chai.request(APP)
        .post('/register')
        .send({
          username: USERNAME,
          password: PASSWORD
        })

      response.status.should.equal(201);

      should.exist(await User.findOne({
        username: USERNAME
      }).exec());
    });

    it('Отправлен логин без пароля, должен вернуть 400 ', async () => {
      let response = await chai.request(APP)
        .post('/login')
        .send({
          username: USERNAME,
        });

      response.status.should.equal(400);
      should.not.exist(response.body.token);
      should.exist(response.body.error);
    });

    it('Отправлен пароль без логина, должен вернуть 400 ', async () => {
      let response = await chai.request(APP)
        .post('/login')
        .send({
          password: PASSWORD,
        });

      response.status.should.equal(400);
      should.not.exist(response.body.token);
      should.exist(response.body.error);
    });

    it('Неверный логин и пароль, должен вернуть 401 ', async () => {
      let response = await chai.request(APP)
        .post('/login')
        .send({
          username: WRONGUSERNAME,
          password: WRONGPASSWORD
        });

      response.status.should.equal(401);
      should.not.exist(response.body.token);
    });

    it('Верный логин и пароль, должен вернуть токен и 201', async () => {
      let response = await chai.request(APP)
        .post('/login')
        .send({
          username: USERNAME,
          password: PASSWORD
        });

      response.status.should.equal(200);
      jsonToken = response.body.token;
      should.exist(response.body.token);
    });
  });


  describe('Проверка доступа к приватным роутам', () => {
    it('Доступ к get /news без токена должен вернуть 401', async () => {
      let response = await chai.request(APP)
        .get('/news');

      response.status.should.equal(401);
    });

    it('Доступ к post /news без токена должен вернуть 401', async () => {
      let response = await chai.request(APP)
        .post('/news');

      response.status.should.equal(401);
    });

    it('Доступ к put /news/id без токена должен вернуть 401', async () => {
      let response = await chai.request(APP)
        .put('/news/id');

      response.status.should.equal(401);
    });

    it('Доступ к delete /news/id без токена должен вернуть 401', async () => {
      let response = await chai.request(APP)
        .delete('/news/id');

      response.status.should.equal(401);
    });

    it('get /news с токеном должен вернуть json объекты новостей и 200', async () => {
      let response = await chai.request(APP)
        .get('/news')
        .set('Authorization', `Bearer ${jsonToken}`);

      response.status.should.equal(200);
      response.type.should.equal('application/json');
    });

    it('post /news должен создавать новость в бд (заголовок, текст, id пользователя) и возвращать 201', async () => {
      let response = await chai.request(APP)
        .post('/news')
        .set('Authorization', `Bearer ${jsonToken}`)
        .send({
          header: HEADER,
          text: TEXT
        });

      response.status.should.equal(201);
      should.exist(response.body.newsId);
      idForNews = response.body.newsId;

      const jwtEncoded = jwt.verify(jsonToken, secretString);

      should.exist(await News.findOne({
        _id: new ObjectId(idForNews),
        header: HEADER,
        text: TEXT,
        userId: jwtEncoded.id
      }).exec());

    });

    it('put /news/id должен обновлять новость в бд (заголовок, текст) и возвращать 200', async () => {
      let response = await chai.request(APP)
        .put(`/news/${idForNews}`)
        .set('Authorization', `Bearer ${jsonToken}`)
        .send({
          header: NEWHEADER,
          text: NEWTEXT
        });

      response.status.should.equal(200);

      const jwtEncoded = jwt.verify(jsonToken, secretString);

      should.exist(await News.findOne({
        _id: new ObjectId(idForNews),
        header: NEWHEADER,
        text: NEWTEXT,
        userId: jwtEncoded.id
      }).exec());
    });

    it('delete /news/id должен удалять новость в бд и возвращать 202', async () => {
      let response = await chai.request(APP)
        .delete(`/news/${idForNews}`)
        .set('Authorization', `Bearer ${jsonToken}`);

      response.status.should.equal(202);

      const jwtEncoded = jwt.verify(jsonToken, secretString);

      should.not.exist(await News.findOne({
        _id: new ObjectId(idForNews),
        header: NEWHEADER,
        text: NEWTEXT,
        userId: jwtEncoded.id
      }).exec());
    });

  });

});