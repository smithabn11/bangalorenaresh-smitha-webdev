/**
 * Created by smitha on 11/11/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var ShopperSchema = require("./shopper.schema.server.js")();
    var ShopperModel;
    if (mongoose.models.ShopperModel) {
        ShopperModel = mongoose.model("ShopperModel");
    } else {
        ShopperModel = mongoose.model("ShopperModel", ShopperSchema);
    }

    var api = {
        createShopper: createShopper,
        findShopperById: findShopperById,
        findShopperByUsername: findShopperByUsername,
        findShopperByCredentials: findShopperByCredentials,
        updateShopper: updateShopper,
        deleteShopper: deleteShopper,
        findShopperByGoogleId: findShopperByGoogleId,
        findShopperByFacebookId: findShopperByFacebookId,
        addItemWishlist: addItemWishlist,
        deleteItemWishlist: deleteItemWishlist,
        findAllShoppers: findAllShoppers
    }

    return api;

    function createShopper(user) {
        return ShopperModel.create(user);
    }

    function findShopperById(userId) {
        return ShopperModel.findById(userId);
    }

    function findShopperByUsername(username) {
        var result = ShopperModel.findOne({username: username});
        return result;
    }

    function findShopperByCredentials(username, password) {
        return ShopperModel.findOne({username: username, password: password});
    }

    function updateShopper(userId, user) {
        delete user._id;
        return ShopperModel.update({_id: userId}, {$set: user});
    }

    function deleteShopper(userId) {
        return ShopperModel.remove({_id: userId});
    }


    function findShopperByFacebookId(facebookId) {
        return ShopperModel.findOne({'facebook.id': facebookId});
    }

    function findShopperByGoogleId(googleId) {
        return ShopperModel.findOne({'google.id': googleId});
    }

    function addItemWishlist(userId, itemId) {
        return ShopperModel.update({_id: userId}, {$addToSet: {'wishlist': itemId}});
    }

    function deleteItemWishlist(userId, itemId) {
        return ShopperModel.update({_id: userId}, {$pull: {'wishlist': itemId}});
    }

    function findAllShoppers() {
        return ShopperModel.find();
    }

}