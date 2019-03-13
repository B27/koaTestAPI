const bcrypt = require('bcrypt');
const userModel = require('../model/User');

module.exports = {
    async getByName(name) {
        return await userModel.findOne({ username: name }).exec();
    },

    async insertOne(usrname, pwrd) {
        const pwrdHash = await bcrypt.hash(pwrd, 5);

        await userModel.create({
            username: usrname,
            passwordHash: pwrdHash
        });
    }
}