/**
 * Created by smitha on 10/6/16.
 */
(function () {
    angular.module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService() {
        var pages = [
            { "_id": "321", "name": "Post 1", "websiteId": "456" },
            { "_id": "432", "name": "Post 2", "websiteId": "456" },
            { "_id": "543", "name": "Post 3", "websiteId": "456" },
            { "_id": "123", "name": "Chess Post 1", "websiteId": "789" },
            { "_id": "124", "name": "Chess Post 2", "websiteId": "789" },
            { "_id": "125", "name": "Chess Post 3", "websiteId": "789" }
        ];

        var api = {
            "createPage": createPage,
            "findPageByWebsiteId": findPageByWebsiteId,
            "findPageById": findPageById,
            "updatePage": updatePage,
            "deletePage":deletePage
        };

        return api;

        function createPage(websiteId, page) {

        }

        function findPageByWebsiteId(websiteId) {
            var result = [];
            for(var p in pages) {
                if(pages[p].websiteId === websiteId) {
                    result.push(pages[p]);
                }
            }
            console.log(result);
            return result;
        }

        function findPageById(pageId) {
            for(var p in pages) {
                if(pages[p]._id === pageId) {
                    return pages[p];
                }
            }
        }

        function updatePage(pageId, page) {

        }

        function deletePage(pageId) {

        }
    }
})();