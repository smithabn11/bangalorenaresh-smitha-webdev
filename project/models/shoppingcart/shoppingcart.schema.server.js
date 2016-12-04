/**
 * Created by smitha on 11/15/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var ShoppingCartSchema = mongoose.Schema({
        _shopper: {type: mongoose.Schema.ObjectId, ref: 'ShopperModel'},
        items: [{
            itemId: Number,
            quantity: Number,
            price: Number
        }],
        total: {type: Number},
        dateCreated: {type: Date, default: Date.now}
    });
    return ShoppingCartSchema;
}