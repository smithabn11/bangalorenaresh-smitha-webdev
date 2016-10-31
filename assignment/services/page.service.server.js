/**
 * Created by smitha on 10/30/16.
 */
module.exports = function (app) {
    var pages = [
        {"_id": "321", "name": "Post 1", "websiteId": "456", "title": "Post 1 title"},
        {"_id": "432", "name": "Post 2", "websiteId": "456", "title": "Post 2 title"},
        {"_id": "543", "name": "Post 3", "websiteId": "456", "title": "Post 3 title"},
        {"_id": "123", "name": "Chess Post 1", "websiteId": "789", "title": "Chess Post 1 title"},
        {"_id": "124", "name": "Chess Post 2", "websiteId": "789", "title": "Chess Post 2 title"},
        {"_id": "125", "name": "Chess Post 3", "websiteId": "789", "title": "Chess Post 3 title"}
    ];

    app.get("/api/user/:uid/website/:wid/page", findPageByWebsiteId);
    app.get("/api/user/:uid/website/:wid/page/:pid", findPageById);
    app.post("/api/user/:uid/website/:wid/page", createPage);
    app.put("/api/user/:uid/website/:wid/page/:pid", updatePage);
    app.delete("/api/user/:uid/website/:wid/page/:pid", deletePage);

    function findPageByWebsiteId(req, res) {
        var wid = req.params['wid'];
        var result = [];
        for (var p in pages) {
            if (pages[p].websiteId == wid) {
                result.push(pages[p]);
            }
        }
        res.json(result); //helps to skip over the type of data in content type. more explicit

    }

    function findPageById(req, res) {
        var pageId = req.params['pid'];
        for (var p in pages) {
            if (pages[p]._id == pageId) {
                res.send(pages[p]);
                return;
            }
        }
        res.send('0');
    }

    function createPage(req, res) {
        var page = req.body;
        pages.push(page);
        res.send(200);
    }

    function updatePage(req, res) {
        var pageUpdated = req.body;
        var pageId = req.params['pid'];

        for (var p in pages) {
            if (pages[p]._id == pageId) {
                pages[p] = pageUpdated;
            }
        }
        res.send(200); //just update successfully
    }

    function deletePage(req, res) {
        var pageId = req.params['pid'];

        for (var p in pages) {
            if (pages[p]._id == pageId) {
                pages.splice(p, 1);
            }
        }
        res.send(200);
    }

}