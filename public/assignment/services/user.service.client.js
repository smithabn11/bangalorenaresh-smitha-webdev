/**
 * Created by smitha on 10/6/16.
 */
(function () {
    angular.module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService($http) {
        // var users = [
        //     {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder"},
        //     {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley"},
        //     {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia"},
        //     {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi"}
        // ];

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
            // if(user != null) {
            //     users.push(user);
            // }
            // console.log(users);
            return $http.post("/api/user", user);
        }

        function findUserByCredentials(username, password) {
            // for (var u in users) {
            //     var user = users[u];
            //     if (user.username === username && user.password === password) {
            //         return user;
            //     }
            // }
            // return null;
            var url = '/api/user?username='+username+'&password='+password;
            return $http.get(url);

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
            // for (var u in users) {
            //     var user = users[u];
            //     if (user._id == userId) {
            //         return user;
            //     }
            // }
            // return null;

            var url = '/api/user/'+ userId;
            return $http.get(url);
        }

        function updateUser(userUpdated) {
            // for (var u in users) {
            //     var user = users[u];
            //     if (user._id == userId) {
            //         users[u] = userUpdated;
            //     }
            // }

            var url = "/api/user/" + userUpdated._id;
            return $http.put(url, userUpdated);
        }

        function deleteUser(userId) {
            // for (var u in users) {
            //     var user = users[u];
            //     if (user._id == userId) {
            //         users.splice(u, 1);
            //     }
            // }

            var url = "/api/user/" + userId;
            return $http.delete(url);
        }
    }


})();