/**
 * Created by smitha on 10/6/16.
 */
(function () {
    angular.module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService($http) {
        // var pages = [
        //     { "_id": "321", "name": "Post 1", "websiteId": "456", "title": "Post 1 title" },
        //     { "_id": "432", "name": "Post 2", "websiteId": "456", "title": "Post 2 title" },
        //     { "_id": "543", "name": "Post 3", "websiteId": "456", "title": "Post 3 title" },
        //     { "_id": "123", "name": "Chess Post 1", "websiteId": "789", "title": "Chess Post 1 title" },
        //     { "_id": "124", "name": "Chess Post 2", "websiteId": "789", "title": "Chess Post 2 title" },
        //     { "_id": "125", "name": "Chess Post 3", "websiteId": "789", "title": "Chess Post 3 title" }
        // ];

        var api = {
            "createPage": createPage,
            "findPageByWebsiteId": findPageByWebsiteId,
            "findPageById": findPageById,
            "updatePage": updatePage,
            "deletePage": deletePage
        };

        return api;

        function createPage(userId, websiteId, page) {
            // if(page != null) {
            //     pages.push(page);
            // }
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page";
            return $http.post(url, page);

        }

        function findPageByWebsiteId(userId, websiteId) {
            // var result = [];
            // for(var p in pages) {
            //     if(pages[p].websiteId === websiteId) {
            //         result.push(pages[p]);
            //     }
            // }
            // return result;

            var url = "/api/user/" + userId + "/website/" + websiteId + "/page";
            return $http.get(url);
        }

        function findPageById(userId, websiteId, pageId) {
            // for(var p in pages) {
            //     if(pages[p]._id === pageId) {
            //         return pages[p];
            //     }
            // }

            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId;
            return $http.get(url);
        }

        function updatePage(userId, websiteId, pageId, page) {
            // for(var p in pages) {
            //     if (pages[p]._id === pageId) {
            //         pages[p] = page;
            //     }
            // }
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId;
            return $http.put(url, page);
        }

        function deletePage(userId, websiteId, pageId) {
            // for(var p in pages) {
            //     if (pages[p]._id === pageId) {
            //         pages.splice(p, 1);
            //     }
            // }
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId;
            return $http.delete(url);
        }
    }
})();