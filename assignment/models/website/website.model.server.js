/**
 * Created by smitha on 11/11/16.
 */
module.exports = function (mongoose) {
    var mongoose = require("mongoose");
    var WebsiteSchema = require("./website.schema.server.js")();
    var WebsiteModel = mongoose.model("WebsiteModel", WebsiteSchema);

    var api = {
        createWebsiteForUser : createWebsiteForUser,
        findWebsiteById : findWebsiteById,
        findWebsitesByUser : findWebsitesByUser,
        updateWebsite : updateWebsite,
        deleteWebsite : deleteWebsite
    }

    return api;

    function createWebsiteForUser(userId, website) {
        website._user = userId;
        return WebsiteModel.create(website);
    }

    function findWebsiteById(websiteId) {
        return WebsiteModel.findById(websiteId);
    }

    function findWebsitesByUser(userId) {
        return WebsiteModel.find({_user: userId});
    }

    function updateWebsite(websiteId, website) {
        delete website._id;
        return WebsiteModel.update({_id : websiteId} , {$set : website});
    }

    function deleteWebsite(websiteId) {
        return WebsiteModel.remove({_id: websiteId});
    }
}