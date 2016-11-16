/**
 * Created by smitha on 10/27/16.
 */
module.exports = function (app, models) {

    // var websites = [
    //     {"_id": "123", "name": "Facebook", "developerId": "456", "description": "Facebook site"},
    //     {"_id": "234", "name": "Tweeter", "developerId": "456", "description": "Tweeter site"},
    //     {"_id": "456", "name": "Gizmodo", "developerId": "456", "description": "Gizmodo site"},
    //     {"_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Tic Tac Toe site"},
    //     {"_id": "678", "name": "Checkers", "developerId": "123", "description": "Checkers site"},
    //     {"_id": "789", "name": "Chess", "developerId": "234", "description": "Chess site"}
    // ];

    app.get("/api/user/:uid/website", findWebsitesByUser);
    app.get("/api/user/:uid/website/:wid", findWebsiteById);
    app.post("/api/user/:uid/website", createWebsite);
    app.put("/api/user/:uid/website/:wid", updateWebsite);
    app.delete("/api/user/:uid/website/:wid", deleteWebsite);

    var websiteModel = models.websiteModel;
    var userModel = models.userModel;

    function findWebsitesByUser(req, res) {
        var userId = req.params.uid;
        // var result = [];
        // for (var w in websites) {
        //     if (websites[w].developerId == uid) {
        //         result.push(websites[w]);
        //     }
        // }
        // res.json(result); //helps to skip over the type of data in content type. more explicit

        websiteModel.findWebsitesByUser(userId)
            .then(
                function (websites) {
                    res.json(websites);
                },
                function (error) {
                    res.sendStatus(404);
                }
            );

    }

    function createWebsite(req, res) {
        var userId = req.params.uid;
        var website = req.body;
        // websites.push(website);
        // res.send(200);

        websiteModel.createWebsiteForUser(userId, website)
            .then(
                function (website) {
                    res.json(website);
                    return website;
                },
                function (error) {
                    res.sendStatus(404);
                }
            ).then(
            function (website) {
                saveWebsiteToUser(userId, website._id);
            },
            function (error) {
                console.log("Error in creating Website " + website.name);
            }
        );
    }

    function saveWebsiteToUser(userId, websiteId) {
        userModel.findUserById(userId)
            .then(
                function (user) {
                    user.websites.push(websiteId);
                    user.save();
                },
                function (error) {
                    console.log("Error to linking Website to User " + userId);
                }
            );
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params['wid'];

        // for (var w in websites) {
        //     if (websites[w]._id == websiteId) {
        //         res.send(websites[w]);
        //         return;
        //     }
        // }
        // res.send('0');

        websiteModel.findWebsiteById(websiteId)
            .then(
                function (website) {
                    if(website != null) {
                        res.json(website);
                    } else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400);
                }
            )
    }

    function updateWebsite(req, res) {
        var websiteUpdated = req.body;
        var websiteId = req.params['wid'];

        // for (var w in websites) {
        //     if (websites[w]._id == websiteId) {
        //         websites[w] = websiteUpdated;
        //     }
        // }
        // res.send(200); //just update successfully

        websiteModel.updateWebsite(websiteId, websiteUpdated)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.statusCode(400).send("Unable to update website info");
                }
            );
    }

    function deleteWebsite(req, res) {
        var websiteId = req.params['wid'];

        // for (var w in websites) {
        //     if (websites[w]._id == websiteId) {
        //         websites.splice(w, 1);
        //     }
        // }
        // res.send(200); //just send success

        websiteModel.findWebsiteById(websiteId)
            .then(
                function (website) {
                    removeWebsiteFromUser(website._user, websiteId);
                    return websiteId;
                },
                function (error) {
                    res.sendStatus(404);
                }
            ).then(
            function (websiteId) {
                websiteModel.deleteWebsite(websiteId)
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


    function removeWebsiteFromUser(userId, websiteId) {
        userModel.findUserById(userId)
            .then(
                function (user) {
                    var index = user.websites.indexOf(websiteId);
                    if (idx > -1) {
                        user.websites.splice(index, 1);
                        user.save();
                    }
                    else {
                        console.log("Website Id " + websiteId + " not found in User " + user._id);
                    }
                },
                function (error) {
                    console.log("Error to removing Website from User " + userId);
                }
            );
    }
}