/**
 * Created by smitha on 10/30/16.
 */
module.exports = function (app, models) {
    // var pages = [
    //     {"_id": "321", "name": "Post 1", "websiteId": "456", "title": "Post 1 title"},
    //     {"_id": "432", "name": "Post 2", "websiteId": "456", "title": "Post 2 title"},
    //     {"_id": "543", "name": "Post 3", "websiteId": "456", "title": "Post 3 title"},
    //     {"_id": "123", "name": "Chess Post 1", "websiteId": "789", "title": "Chess Post 1 title"},
    //     {"_id": "124", "name": "Chess Post 2", "websiteId": "789", "title": "Chess Post 2 title"},
    //     {"_id": "125", "name": "Chess Post 3", "websiteId": "789", "title": "Chess Post 3 title"}
    // ];

    app.get("/api/user/:uid/website/:wid/page", findPageByWebsiteId);
    app.get("/api/user/:uid/website/:wid/page/:pid", findPageById);
    app.post("/api/user/:uid/website/:wid/page", createPage);
    app.put("/api/user/:uid/website/:wid/page/:pid", updatePage);
    app.delete("/api/user/:uid/website/:wid/page/:pid", deletePage);

    var pageModel = models.pageModel;
    var websiteModel = models.websiteModel;

    function findPageByWebsiteId(req, res) {
        var websiteId = req.params['wid'];
        // var result = [];
        // for (var p in pages) {
        //     if (pages[p].websiteId == wid) {
        //         result.push(pages[p]);
        //     }
        // }
        // res.json(result); //helps to skip over the type of data in content type. more explicit

        pageModel.findPageByWebsiteId(websiteId)
            .then(
                function (pages) {
                    res.json(pages);
                },
                function (error) {
                    res.sendStatus(404);
                }
            );

    }

    function findPageById(req, res) {
        var pageId = req.params['pid'];
        // for (var p in pages) {
        //     if (pages[p]._id == pageId) {
        //         res.send(pages[p]);
        //         return;
        //     }
        // }
        // res.send('0');

        pageModel.findPageById(pageId)
            .then(
                function (page) {
                    if(page != null) {
                        res.json(page);
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400);
                }
            )
    }

    function createPage(req, res) {
        var websiteId = req.params['wid'];
        var page = req.body;
        // pages.push(page);
        // res.send(200);

        pageModel.createPage(websiteId, page)
            .then(
                function (page) {
                    res.json(page);
                    return page;
                },
                function (error) {
                    res.sendStatus(404);
                }
            ).then(
            function (page) {
                savePageToWebsite(websiteId, page._id);
            },
            function (error) {
                console.log("Error in creating Page " + page.name);
            }
        );
    }


    function savePageToWebsite(websiteId, pageId) {
        websiteModel.findWebsiteById(websiteId)
            .then(
                function (website) {
                    website.pages.push(pageId);
                    website.save();
                },
                function (error) {
                    console.log("Error to linking Page to Website " + websiteId);
                }
            );
    }

    function updatePage(req, res) {
        var pageUpdated = req.body;
        var pageId = req.params['pid'];

        // for (var p in pages) {
        //     if (pages[p]._id == pageId) {
        //         pages[p] = pageUpdated;
        //     }
        // }
        // res.send(200); //just update successfully

        pageModel.updatePage(pageId, pageUpdated)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.statusCode(400).send("Unable to update page info");
                }
            );
    }

    function deletePage(req, res) {
        var pageId = req.params['pid'];

        // for (var p in pages) {
        //     if (pages[p]._id == pageId) {
        //         pages.splice(p, 1);
        //     }
        // }
        // res.send(200);

        pageModel.findPageById(pageId)
            .then(
                function (page) {
                    removePageFromWebsite(page._website, pageId);
                    return pageId;
                },
                function (error) {
                    res.sendStatus(404);
                }
            ).then(
            function (pageId) {
                pageModel.deletePage(pageId)
                    .then(
                        function (status) {
                            res.sendStatus(200);
                        },
                        function (error) {
                            res.sendStatus(404);
                        }
                    );
            }
        );
    }

    function removePageFromWebsite(websiteId, pageId) {
        websiteModel.findWebsiteById(websiteId)
            .then(
                function (website) {
                    var index = website.pages.indexOf(pageId);
                    if (idx > -1) {
                        website.pages.splice(index, 1);
                        website.save();
                    }
                    else {
                        console.log("Page Id " + pageId + " not found in Website " + website.name);
                    }
                },
                function (error) {
                    console.log("Error to removing Page from Website " + websiteId);
                }
            );
    }
}