/**
 * Created by smitha on 10/24/16.
 */
module.exports = function (app, models) {
    // var users = [
    //     {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder"},
    //     {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley"},
    //     {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia"},
    //     {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi"}
    // ];

    app.get('/api/user', findUser);
    app.get('/api/user/:uid', findUserById);
    app.post('/api/user', createUser);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);

    var userModel = models.userModel;

    function createUser(req, res) {
        var newUser = req.body; //to get the user object
        // user._id = (new Date()).getTime() + "";
        // users.push(user);
        // res.send(user);

        userModel.findUserByUsername(newUser.username)
            .then(function (user) {
                if (user) {
                    res.status(400).send("Username already present");
                } else {
                    userModel.createUser(newUser)
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

    function findUser(req, res) {
        var params = req.params; //for path param
        var query = req.query; //for query param
        if (query.password && query.username) {
            findUserByCredentials(req, res);
        } else if (query.username) {
            findUserByUsername(req, res);
        }

    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        // for (var u in users) {
        //     if (users[u].username == username) {
        //         res.send(users[u]);
        //         return;
        //     }
        // }
        // res.send('0');

        userModel.findUserByUsername(username)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        userModel.findUserByCredentials(username, password)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function findUserById(req, res) {
        var userId = req.params.uid;

        userModel.findUserById(userId)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(400);
                }
            );
    }

    function updateUser(req, res) {
        var userUpdated = req.body;
        var userId = req.params['uid']; //can also use req.params.uid

        // for (var u in users) {
        //     if (users[u]._id == userId) {
        //         users[u] = userUpdated;
        //     }
        // }
        // res.send(200); //just update successfully

        userModel.updateUser(userId, userUpdated)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.statusCode(400).send("Unable to update user info");
                }
            );
    }

    function deleteUser(req, res) {
        var userId = req.params['uid'];

        // for (var u in users) {
        //     if (users[u]._id == userId) {
        //         users.splice(u, 1);
        //     }
        // }
        //
        // res.send(200); //just update successfully

        userModel.deleteUser(userId)
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