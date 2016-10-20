/**
 * Created by smitha on 10/6/16.
 */
(function () {
    angular.module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService() {
        var users = [
            {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder"},
            {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley"},
            {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia"},
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi"}
        ];

        var api = {
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser":updateUser,
            "deleteUser":deleteUser
        };

        return api;

        function createUser(user) {
            if(user != null) {
                users.push(user);
            }
            console.log(users);
        }

        function findUserByCredentials(username, password) {
            for (var u in users) {
                var user = users[u];
                if (user.username === username && user.password === password) {
                    return user;
                }
            }
            return null;
        }

        function findUserByUsername(username) {
            for (var u in users) {
                var user = users[u];
                if (user.username === username) {
                    return user;
                }
            }
            return null;
        }


        function findUserById(userId) {
            for (var u in users) {
                var user = users[u];
                if (user._id == userId) {
                    return user;
                }
            }
            return null;
        }

        function updateUser(userId, userUpdated) {
            for (var u in users) {
                var user = users[u];
                if (user._id == userId) {
                    users[u] = userUpdated;
                }
            }
        }

        function deleteUser(userId) {
            for (var u in users) {
                var user = users[u];
                if (user._id == userId) {
                    users.splice(u, 1);
                }
            }
        }
    }


})();