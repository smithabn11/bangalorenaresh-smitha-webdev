/**
 * Created by smitha on 10/6/16.
 */
(function () {
    angular.module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService($http) {

        var api = {
            "createWidget": createWidget,
            "findWidgetsByPageId": findWidgetsByPageId,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget,
            "uploadImage": uploadImage,
            "sort": sort
        };

        return api;

        function sort(start, end) {
            var url = "/api/sort?start=START&end=END";
            url = url.replace("START", start)
                .replace("END", end);
            $http.put(url);
        }

        function createWidget(userId, websiteId, pageId, widget) {
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget";
            return $http.post(url, widget);
        }

        function findWidgetsByPageId(userId, websiteId, pageId) {
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget";
            return $http.get(url);
        }

        function findWidgetById(userId, websiteId, pageId, widgetId) {
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId;
            return $http.get(url);
        }

        function updateWidget(userId, websiteId, pageId, widget) {
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widget._id;
            return $http.put(url, widget);
        }

        function deleteWidget(userId, websiteId, pageId, widgetId) {
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId;
            return $http.delete(url);
        }

        function uploadImage(formData) {
            var url = "/api/upload";
            return $http.post(url, formData, {
                withCredentials: true,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            });
        }
    }
})();