/**
 * Created by smitha on 10/6/16.
 */
(function () {
    angular.module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService($http) {
        // var widgets =
        //     [
        //         {"_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
        //         {"_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        //         {
        //             "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
        //             "url": "http://lorempixel.com/400/200/"
        //         },
        //         {"_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        //         {"_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        //         {
        //             "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
        //             "url": "https://youtu.be/AM2Ivdi9c4E"
        //         },
        //         {"_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
        //     ];

        var api = {
            "createWidget": createWidget,
            "findWidgetsByPageId": findWidgetsByPageId,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget
        };

        return api;

        function createWidget(userId, websiteId, pageId, widget) {
            // if(widget != null) {
            //     widgets.push(widget);
            // }
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget";
            return $http.post(url, widget);
        }

        function findWidgetsByPageId(userId, websiteId, pageId) {
            // var result = [];
            // for(var w in widgets) {
            //     if(widgets[w].pageId === pageId) {
            //         result.push(widgets[w]);
            //     }
            // }
            // return result;
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget";
            return $http.get(url);
        }

        function findWidgetById(userId, websiteId, pageId, widgetId) {
            // for(var w in widgets) {
            //     if(widgets[w]._id === widgetId) {
            //         return widgets[w];
            //     }
            // }
            // return null;
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId;
            return $http.get(url);
        }

        function updateWidget(userId, websiteId, pageId, widget) {
            // for(var w in widgets) {
            //     if(widgets[w]._id === widgetId) {
            //         widgets[w] = widget;
            //     }
            // }
            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widget._id;
            return $http.put(url, widget);
        }

        function deleteWidget(userId, websiteId, pageId, widgetId) {
            // for(var w in widgets) {
            //     if(widgets[w]._id === widgetId) {
            //         widgets.splice(w, 1);
            //     }
            // }

            var url = "/api/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/" + widgetId;
            return $http.delete(url);
        }
    }
})();