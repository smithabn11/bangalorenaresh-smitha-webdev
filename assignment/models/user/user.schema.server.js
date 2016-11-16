/**
 * Created by smitha on 11/11/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var UserSchema = mongoose.Schema({
        username: {type: String, required: true},
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        websites: [{type: mongoose.Schema.ObjectId, ref: 'WebsiteModel'}],
        dateCreated: {type: Date, default: Date.now}
    });
    return UserSchema;
}