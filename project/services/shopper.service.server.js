/**
 * Created by smitha on 10/24/16.
 */
module.exports = function (app) {
    var users = [
        {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder"},
        {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley"},
        {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia"},
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi"}
    ];

    app.get('/api/shopper', findUser);
    app.get('/api/shopper/:uid', findUserById);
    app.post('/api/shopper', createUser);
    app.put('/api/shopper/:uid', updateUser);
    app.delete('/api/shopper/:uid', deleteUser);

    function createUser(req, res) {
        var user = req.body; //to get the shopper object
        user._id = (new Date()).getTime() + "";
        users.push(user);
        res.send(user);
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
        for (var u in users) {
            if (users[u].username == username) {
                res.send(users[u]);
                return;
            }
        }
        res.send('0');
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        for (var u in users) {
            if (users[u].username === username && users[u].password === password) {
                res.send(users[u]);
                return;
            }
        }
        res.send('0');
    }

    function findUserById(req, res) {
        var userId = req.params.uid;
        for (var u in users) {
            if (users[u]._id == userId) {
                res.send(users[u]);
                return;
            }
        }
        res.send('0');
    }

    function updateUser(req, res) {
        var userUpdated = req.body;
        var userId = req.params['uid']; //can also use req.params.uid

        for (var u in users) {
            if (users[u]._id == userId) {
                users[u] = userUpdated;
            }
        }
        res.send(200); //just update successfully
    }

    function deleteUser(req, res) {
        var userId = req.params['uid'];

        for (var u in users) {
            if (users[u]._id == userId) {
                users.splice(u, 1);
            }
        }

        res.send(200); //just update successfully
    }
}