/**
 * Created by smitha on 11/15/16.
 */
module.exports = function() {
    var mongoose = require("mongoose");
    var ShoppingCartSchema = mongoose.Schema({
        _user: {type : mongoose.Schema.ObjectId, ref : 'ShopperModel'},
        items: [{type: Number}]
    });
    return ShoppingCartSchema;
}