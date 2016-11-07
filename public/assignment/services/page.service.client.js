/**
 * Created by smitha on 10/6/16.
 */
(function () {
    angular.module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService($http) {

        var api = {
            "createPage": createPage,
            "findPageByWebsiteId": findPageByWebsiteId,
            "findPageById": findPageById,
            "updatePage": updatePage,
            "deletePage": deletePage
        };

        return api;

        function createPage(userId, websiteId, page) {
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page";
            return $http.post(url, page);

        }

        function findPageByWebsiteId(userId, websiteId) {
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page";
            return $http.get(url);
        }

        function findPageById(userId, websiteId, pageId) {
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId;
            return $http.get(url);
        }

        function updatePage(userId, websiteId, pageId, page) {
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId;
            return $http.put(url, page);
        }

        function deletePage(userId, websiteId, pageId) {
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId;
            return $http.delete(url);
        }
    }
})();