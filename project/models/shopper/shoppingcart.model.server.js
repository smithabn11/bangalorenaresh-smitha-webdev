/**
 * Created by smitha on 11/17/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var ShoppingCartSchema = require("./shoppingcart.schema.server.js")();
    var ShopperModel = mongoose.model("ShoppingCartModel", ShoppingCartSchema);

    var api = {
        createShoppingCart: createShoppingCart,
        findShoppingCartById: findShoppingCartById,
        findShoppingCartByShopperId: findShoppingCartByShopperId,
        updateShoppingCart: updateShoppingCart,
        deleteShoppingCart: deleteShoppingCart
    }

    return api;

    function createShoppingCart(cart) {
        return ShoppingCartModel.create(cart);
    }

    function findShoppingCartByShopperId(userId) {
        return ShoppingCartModel.find({_user: userId});
    }

    function findShoppingCartById(cartId) {
        return ShoppingCartModel.findById(cartId);
    }

    function updateShoppingCart(userId, cartId, cart) {
        return ShoppingCartModel.update({_id: cartId}, {$set: cart});
    }

    function deleteShoppingCart(userId, cartId) {
        return ShoppingCartModel.remove({_id: cartId});
    }
}