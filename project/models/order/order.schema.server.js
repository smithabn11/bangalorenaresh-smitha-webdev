/**
 * Created by smitha on 12/4/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var OrderSchema = mongoose.Schema({
        _shopper: {type: mongoose.Schema.ObjectId, ref: 'ShopperModel'},
        items: [{
            itemId: Number,
            quantity: Number,
            price: Number
        }],
        total: {type: Number},
        dateCreated: {type: Date, default: Date.now},
        submitted: {type: Boolean, default: false},
        transactionSuccess: {type: Boolean},
        shippingStreet: String,
        shippingCity: String,
        shippingState: String,
        shippingZipcode: Number
    });
    return OrderSchema;
}