/**
 * Created by smitha on 11/11/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var ShopperSchema = require("./shopper.schema.server.js")();
    var ShopperModel = mongoose.model("ShopperModel", ShopperSchema);

    var api = {
        createShopper: createShopper,
        findShopperById: findShopperById,
        findShopperByUsername: findShopperByUsername,
        findShopperByCredentials: findShopperByCredentials,
        updateShopper: updateShopper,
        deleteShopper: deleteShopper,
        addItemtoWishlist : addItemtoWishlist
    }

    return api;

    function createShopper(user) {
        return ShopperModel.create(user);
    }

    function findShopperById(userId) {
        return ShopperModel.findById(userId);
    }

    function findShopperByUsername(username) {
        return ShopperModel.findOne({username : username});
    }

    function findShopperByCredentials(username, password) {
        return ShopperModel.findOne({username : username, password : password});
    }

    function updateShopper(userId, user) {
        delete user._id;
        return ShopperModel.update({_id : userId} , {$set : user});
    }

    function deleteShopper(userId) {
        return ShopperModel.remove({_id: userId});
    }

    function addItemtoWishlist(userId, itemId) {
        return ShopperModel.update({_id : userId} , {$push: {'wishlist' : itemId}});
    }
}