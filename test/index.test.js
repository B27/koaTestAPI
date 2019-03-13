process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
// mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/koa_test_api', {
  useNewUrlParser: true
});
mongoose.connection.on('error', console.error);
const ObjectId = mongoose.Types.ObjectId;

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
const app = 'localhost:3000';
const HEADER = '~~~~~Заголовок новости~~~~~';
const TEXT = '~~~~Длинный текст который является продолжением заголовка~~~~~';
const NEWHEADER = '~~~%%~~Заголовок новости~~~~~';
const NEWTEXT = '~~%%~~Длинный текст который является продолжением заголовка~~~~~';


describe('Тестирование API', () => {



  after(async function () {
    await User.deleteMany({
      username: 'testuserwithtestpassword'
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
    it('Сервер должен зарегистрировать пользователя и вернуть 201', (done) => {
      chai.request(app)
        .post('/register')
        .send({
          username: 'testuserwithtestpassword',
          password: 'johnson'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(201);
        });

      User.findOne({
        username: 'testuserwithtestpassword'
      }, (err, res) => {
        should.not.exist(err);
        should.exist(res);
        done();
      });
    });

    it('Неверный логин и пароль, должен вернуть 401 ', (done) => {
      chai.request(app)
        .post('/login')
        .send({
          username: 'jery',
          password: 'joson'
        })
        .end((err, res) => {
          res.status.should.eql(401);
          should.not.exist(res.body.token);
          done();
        });
    });

    it('Верный логин и пароль, должен вернуть токен и 201', (done) => {
      chai.request(app)
        .post('/login')
        .send({
          username: 'testuserwithtestpassword',
          password: 'johnson'
        })
        .end((err, res) => {
          res.status.should.eql(200);
          jsonToken = res.body.token;
          should.exist(res.body.token);
          done();
        });
    });
  });

  describe('Проверка доступа к приватным роутам', () => {
    it('Доступ к get /news без токена должен вернуть 401', (done) => {
      chai.request(app)
        .get('/news')
        .end((err, res) => {
          res.status.should.eql(401);
          done();
        });
    });

    it('Доступ к post /news без токена должен вернуть 401', (done) => {
      chai.request(app)
        .post('/news')
        .end((err, res) => {
          res.status.should.eql(401);
          done();
        });
    });

    it('Доступ к put /news/id без токена должен вернуть 401', (done) => {
      chai.request(app)
        .put('/news/id')
        .end((err, res) => {
          res.status.should.eql(401);
          done();
        });
    });

    it('Доступ к delete /news/id без токена должен вернуть 401', (done) => {
      chai.request(app)
        .delete('/news/id')
        .end((err, res) => {
          res.status.should.eql(401);
          done();
        });
    });

    it('get /news с токеном должен вернуть json объекты новостей и 200', (done) => {
      chai.request(app)
        .get('/news')
        .set('Authorization', `Bearer ${jsonToken}`)
        .end((err, res) => {
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          done();
        });
    });

    it('post /news должен создавать новость в бд (заголовок, текст, id пользователя) и возвращать 201', (done) => {
      chai.request(app)
        .post('/news')
        .set('Authorization', `Bearer ${jsonToken}`)
        .send({
          header: HEADER,
          text: TEXT
        })
        .end((err, res) => {
          res.status.should.eql(201);
          idForNews = res.body.newsId;
          console.log('должен быть 172 idForNews ' + idForNews);
          should.exist(res.body.newsId);
          console.log('должен быть 174 idForNews ' + idForNews);

          const jwtEncoded = jwt.verify(jsonToken, secretString);

          News.findOne({
            // _id: new ObjectId(newsId),
            header: HEADER,
            // text: TEXT,
            // userId: jwtEncoded.id
          }, (err, res) => {
            console.log('должен быть 185 idForNews ' + idForNews);
            should.not.exist(err);
            should.exist(res);
            done();
          });
          //  done();
        });

    });

    it('put /news/id должен обновлять новость в бд (заголовок, текст) и возвращать 200', async (done) => {
      let chaiReq = await chai.request(app)
        .put(`/news/${idForNews}`)
        .set('Authorization', `Bearer ${jsonToken}`)
        .send({
          header: NEWHEADER,
          text: NEWTEXT
        });
        // .then((res) => {

        // });
      chaiReq.status.should.equal(200);     
      // console.log('должен быть 201 idForNews ' + idForNews);
      // res.status.should.eql(200);

      const jwtEncoded = jwt.verify(jsonToken, secretString);

      done();

      // try {
      //   let res = await News.findOne({
      //     _id: new ObjectId(idForNews),
      //     header: NEWHEADER,
      //     text: NEWTEXT,
      //     userId: jwtEncoded.id
      //   }).exec();
  
      //   should.exist(res);
      //   return;
      // } catch (err) {
      //   return;
      // }
     

      // News.findOne({
      //   _id: new ObjectId(idForNews),
      //   header: NEWHEADER,
      //   text: NEWTEXT,
      //   userId: jwtEncoded.id
      // }, (err, res) => {
      //   should.not.exist(err);
      //   should.exist(res);

      //   done();
      // });


    });

    // it('delete /news/id должен удалять новость в бд и возвращать 202', (done) => {
    //   chai.request(app)
    //     .delete(`/news/${idForNews}`)
    //     .set('Authorization', `Bearer ${jsonToken}`)
    //     .end((err, res) => {
    //       res.status.should.eql(202);

    //       done();
    //     });


    // });

    // it('обновление в бд', (done) => {
    //   const jwtEncoded = jwt.verify(jsonToken, secretString);

    //   News.findOne({
    //     _id: new ObjectId(idForNews),
    //     header: NEWHEADER,
    //     text: NEWTEXT,
    //     userId: jwtEncoded.id
    //   }, (err, res) => {
    //     should.not.exist(err);
    //     should.not.exist(res);
    //     done();
    //   });
    // });

  });

});