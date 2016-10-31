/**
 * Created by smitha on 10/27/16.
 */
module.exports = function (app) {

    var websites = [
        {"_id": "123", "name": "Facebook", "developerId": "456", "description": "Facebook site"},
        {"_id": "234", "name": "Tweeter", "developerId": "456", "description": "Tweeter site"},
        {"_id": "456", "name": "Gizmodo", "developerId": "456", "description": "Gizmodo site"},
        {"_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Tic Tac Toe site"},
        {"_id": "678", "name": "Checkers", "developerId": "123", "description": "Checkers site"},
        {"_id": "789", "name": "Chess", "developerId": "234", "description": "Chess site"}
    ];

    app.get("/api/user/:uid/website", findWebsitesByUser);
    app.get("/api/user/:uid/website/:wid", findWebsiteById);
    app.post("/api/user/:uid/website", createWebsite);
    app.put("/api/user/:uid/website/:wid", updateWebsite);
    app.delete("/api/user/:uid/website/:wid", deleteWebsite);

    function findWebsitesByUser(req, res) {
        var uid = req.params.uid;
        var result = [];
        for (var w in websites) {
            if (websites[w].developerId == uid) {
                result.push(websites[w]);
            }
        }
        res.json(result); //helps to skip over the type of data in content type. more explicit

    }

    function createWebsite(req, res) {
        var website = req.body;
        websites.push(website);
        res.send(200);
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params['wid'];
        for (var w in websites) {
            if (websites[w]._id == websiteId) {
                res.send(websites[w]);
                return;
            }
        }
        res.send('0');
    }

    function updateWebsite(req, res) {
        var websiteUpdated = req.body;
        var websiteId = req.params['wid'];

        for (var w in websites) {
            if (websites[w]._id == websiteId) {
                websites[w] = websiteUpdated;
            }
        }
        res.send(200); //just update successfully
    }

    function deleteWebsite(req, res) {
        var websiteId = req.params['wid'];

        for (var w in websites) {
            if (websites[w]._id == websiteId) {
                websites.splice(w, 1);
            }
        }
        res.send(200); //just send success
    }
}