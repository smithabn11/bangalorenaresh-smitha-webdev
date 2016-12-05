/**
 * Created by smitha on 11/15/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var ShopperSchema = mongoose.Schema({
        username: {type: String},
        password: String,
        isShopper: {type: Boolean, default: true},
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
        street: String,
        city: String,
        state: String,
        zipcode: Number,
        phone: String,
        wishlist: [{type: Number}],
        roles: {type: String, enum: ['ADMIN', 'USER'], default: 'USER'}
    });
    return ShopperSchema;
}