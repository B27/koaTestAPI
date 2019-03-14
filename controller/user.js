const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../model/User');

const secretString = 'secret JWT need jwt';

module.exports = {
    checkThenReturnToken,
    toRegister
}

async function checkThenReturnToken(ctx) {
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

        user = await userModel.findOne({
            username: body.username
        }).exec();
        ctx.status = 200;

    } catch (err) {
        ctx.status = 500;
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
            }, secretString, {
                expiresIn: '5m'
            })
        }
        return;

    } else {

        ctx.status = 401;
        ctx.body = {
            error: "bad password"
        }
        return;

    }
}

async function toRegister(ctx) {
    const body = ctx.request.body;

    if (!body.username || !body.password) {

        ctx.status = 400;
        ctx.body = {
            error: 'expected an object with username and password: ' + body
        }
        return;

    }

    try {

        const pwrdHash = await bcrypt.hash(body.password, 5);
        await userModel.create({
            username: body.username,
            passwordHash: pwrdHash
        });
        ctx.res.statusCode = 201;

    } catch (err) {

        ctx.status = 500;
        console.log(err);

    }
}

