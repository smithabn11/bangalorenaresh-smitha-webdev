/**
 * Created by smitha on 11/15/16.
 */
module.exports = function() {
    var mongoose = require("mongoose");
    var ShopperSchema = mongoose.Schema({
        username: {type: String, required: true},
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        street: String,
        city: String,
        state: String,
        zipcode: Number,
        phone: String
    });
    return ShopperSchema;
}