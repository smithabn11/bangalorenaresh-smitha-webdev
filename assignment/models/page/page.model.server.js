/**
 * Created by smitha on 11/11/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var PageSchema = require("./page.schema.server.js")();
    var PageModel = mongoose.model("PageModel", PageSchema);

    var api = {
        createPage: createPage,
        findPageById: findPageById,
        findPageByWebsiteId: findPageByWebsiteId,
        updatePage: updatePage,
        deletePage: deletePage
    }

    return api;

    function createPage(websiteId, page) {
        page._website = websiteId;
        return PageModel.create(page);
    }

    function findPageById(pageId) {
        return PageModel.findById(pageId);
    }

    function findPageByWebsiteId(websiteId) {
        return PageModel.find({_website: websiteId});
    }

    function updatePage(pageId, page) {
        delete page._id;
        return PageModel.update({_id: pageId}, {$set: page});
    }

    function deletePage(pageId) {
        return PageModel.remove({_id: pageId});
    }
}