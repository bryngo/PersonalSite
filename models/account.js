const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// http://mongoosejs.com/docs/schematypes.html
const Account = new Schema({
    username: String,
    password: String,
    permission: Number
    // -- permissions --
    // 0 = normie
    // 1 = all-powerful admin (Bryan)
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);
