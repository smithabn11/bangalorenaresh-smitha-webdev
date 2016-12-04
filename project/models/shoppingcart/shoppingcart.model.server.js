/**
 * Created by smitha on 11/11/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var ShoppingCartSchema = require("./shoppingcart.schema.server.js")();
    var ShoppingCartModel = mongoose.model("ShoppingCartModel", ShoppingCartSchema);

    var api = {
        createShoppingCart: createShoppingCart,
        findShoppingCartByUserId: findShoppingCartByUserId,
        addItemShoppingCart: addItemShoppingCart,
        removeItemShoppingCart: removeItemShoppingCart,
        deleteShoppingCart: deleteShoppingCart
    }

    return api;

    function createShoppingCart(userId, itemObj) {
        var cart = {
            _shopper: userId,
            items: [itemObj],
            total: itemObj.price * itemObj.quantity
        };
        return ShoppingCartModel.create(cart);
    }

    function findShoppingCartByUserId(userId) {
        return ShoppingCartModel.findOne({_shopper: userId});
    }

    function addItemShoppingCart(userId, itemObj) {
        var totalPrice = itemObj.price * itemObj.quantity;
        return ShoppingCartModel.update({_shopper: userId},
            {$push: {'items': itemObj}},
            {$inc: {'total': totalPrice}});
    }

    function removeItemShoppingCart(userId, itemId) {
        return ShoppingCartModel.update({_shopper: userId}, {$pull: {items: {itemId : itemId}}});
    }

    function deleteShoppingCart(userId) {
        return ShoppingCartModel.remove({_shopper: userId});
    }
}