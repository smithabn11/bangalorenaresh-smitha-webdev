/**
 * Created by smitha on 10/6/16.
 */
(function () {
    angular.module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);

    function WebsiteService($http) {
        // var websites = [
        //     { "_id": "123", "name": "Facebook",    "developerId": "456" , "description": "Facebook site" },
        //     { "_id": "234", "name": "Tweeter",     "developerId": "456" , "description": "Tweeter site" },
        //     { "_id": "456", "name": "Gizmodo",     "developerId": "456" , "description": "Gizmodo site" },
        //     { "_id": "567", "name": "Tic Tac Toe", "developerId": "123" , "description": "Tic Tac Toe site" },
        //     { "_id": "678", "name": "Checkers",    "developerId": "123" , "description": "Checkers site" },
        //     { "_id": "789", "name": "Chess",       "developerId": "234" , "description": "Chess site" }
        // ];

        var api = {
            "createWebsite": createWebsite,
            "findWebsitesByUser": findWebsitesByUser,
            "findWebsiteById": findWebsiteById,
            "updateWebsite": updateWebsite,
            "deleteWebsite":deleteWebsite
        };

        return api;


        function createWebsite(userId, website) {
            // if(website != null) {
            //     websites.push(website);
            // }
            //
            var url = "/api/user/" + userId + "/website";
            return $http.post(url, website);
        }

        function findWebsiteById(userId, websiteId) {
            // for(var w in websites) {
            //     if(websites[w]._id === websiteId) {
            //         return websites[w];
            //     }
            // }
            // return null;

            var url = "/api/user/" + userId + "/website/" + websiteId;
            return $http.get(url);
        }

        function findWebsitesByUser(userId) {
            // var result = [];
            // for(var w in websites) {
            //     if(websites[w].developerId === userId) {
            //         result.push(websites[w]);
            //     }
            // }
            // return result;

            var url = "/api/user/" + userId + "/website";
            return $http.get(url);
        }

        function updateWebsite(userId, website) {
            // for(var w in websites) {
            //     if (websites[w]._id === websiteId) {
            //         websites[w] = website;
            //     }
            // }

            var url = "/api/user/" + userId + "/website/" + website._id;
            return $http.put(url, website);
        }

        function deleteWebsite(userId, websiteId) {
            // for(var w in websites) {
            //     if (websites[w]._id === websiteId) {
            //         websites.splice(w, 1);
            //     }
            // }

            var url = "/api/user/" + userId + "/website/" + websiteId;
            return $http.delete(url);
        }
    }
})();