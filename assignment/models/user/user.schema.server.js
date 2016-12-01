/**
 * Created by smitha on 11/11/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var UserSchema = mongoose.Schema({
        username: {type: String},
        password: String,
        google: {
            id: String,
            token: String
        },
        facebook: {
            id: String,
            token: String
        },
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        roles: {type: String, enum: ['ADMIN', 'USER'], default: 'USER'},
        websites: [{type: mongoose.Schema.ObjectId, ref: 'WebsiteModel'}],
        dateCreated: {type: Date, default: Date.now}
    });
    return UserSchema;
}