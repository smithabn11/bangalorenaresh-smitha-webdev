/**
 * Created by smitha on 10/24/16.
 */
module.exports = function (app, models) {

    app.get('/api/shopper', findShopper);
    app.get('/api/shopper/:uid', findShopperById);
    app.post('/api/shopper', createShopper);
    app.put('/api/shopper/:uid', updateShopper);
    app.delete('/api/shopper/:uid', deleteShopper);

    var shopperModel = models.shopperModel;

    function createShopper(req, res) {
        var newUser = req.body; //to get the shopper object
        shopperModel.findShopperByUsername(newUser.username)
            .then(function (user) {
                if (user) {
                    res.status(400).send("Username already present");
                } else {
                    shopperModel.createShopper(newUser)
                        .then(function (user) {
                                res.json(user);
                            },
                            function (error) {
                                res.statusCode(400).send("Unable to create user");
                            }
                        );
                }
            });
    }

    function findShopper(req, res) {
        var params = req.params; //for path param
        var query = req.query; //for query param
        if (query.password && query.username) {
            findShopperByCredentials(req, res);
        } else if (query.username) {
            findShopperByUsername(req, res);
        }

    }

    function findShopperByUsername(req, res) {
        var username = req.query.username;
        shopperModel.findShopperByUsername(username)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function findShopperByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        shopperModel.findShopperByCredentials(username, password)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function findShopperById(req, res) {
        var userId = req.params.uid;
        shopperModel.findShopperById(userId)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.send('0');
                }
            );
    }

    function updateShopper(req, res) {
        var userUpdated = req.body;
        var userId = req.params['uid']; //can also use req.params.uid

        shopperModel.updateShopper(userId, userUpdated)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.statusCode(400).send("Unable to update user info");
                }
            );
    }

    function deleteShopper(req, res) {
        var userId = req.params['uid'];

        shopperModel.deleteShopper(userId)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.statusCode(400).send("Unable to delete user");
                }
            )
    }

}