/**
 * Created by smitha on 11/11/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var WebsiteSchema = mongoose.Schema({
        _user : {type : mongoose.Schema.ObjectId, ref: 'UserModel'},
        name : String,
        description : String,
        pages: [{type: mongoose.Schema.ObjectId, ref: 'PageModel'}],
        dateCreated: {type: Date, default: Date.now}
        });
    return WebsiteSchema;
}