/**
 * Created by smitha on 10/16/16.
 */
(function () {
    angular.module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);


    function WidgetListController($routeParams, WidgetService, $sce) {
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];
        var pageId = $routeParams['pid'];

        var widgets = WidgetService.findWidgetsByPageId(pageId);

        if (widgets != null) {
            vm.widgets = widgets;
            vm.userId = userId;
            vm.websiteId = websiteId;
            vm.pageId = pageId;
            vm.checkSafeHtml = checkSafeHtml;
            vm.checkSafeYoutubeUrl = checkSafeYoutubeUrl;
        }

        function checkSafeHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function checkSafeYoutubeUrl(url) {
            var parts = url.split('/');
            var id = parts[parts.length - 1];
            var finalUrl = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(finalUrl);
        }
    }

    function NewWidgetController($routeParams, WidgetService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];
        var pageId = $routeParams['pid'];


        vm.userId = userId;
        vm.websiteId = websiteId;
        vm.pageId = pageId;


    }

    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];
        var pageId = $routeParams['pid'];
        var widgetId = $routeParams['wgid'];

        vm.userId = userId;
        vm.websiteId = websiteId;
        vm.pageId = pageId;
        vm.widgetId = widgetId;

        var widget = WidgetService.findWidgetById(widgetId);
        //console.log(widget);
        vm.widget = widget;
        vm.deleteWidget = deleteWidget;

        function updateWidgetHeader(widgetId, name, size, pageId, websiteId, userId) {
            var widget = WidgetService.findWidgetById(wid);

            if (widget != null) {
                widget.text = name;
                widget.size = size;

                WidgetService.updateWidget(widgetId, widget);
            }
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
        }

        function updateWidgetHtml(widgetId, name, pageId, websiteId, userId) {
            var widget = WidgetService.findWidgetById(wid);

            if (widget != null) {
                widget.text = name;

                WidgetService.updateWidget(widgetId, widget);
            }
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
        }

        function updateYoutubeImage(widgetId, name,  url, width, pageId, websiteId, userId) {
            var widget = WidgetService.findWidgetById(wid);

            if (widget != null) {
                widget.text = name;
                widget.url = url;
                widget.width = width;

                WidgetService.updateWidget(widgetId, widget);
            }
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
        }

        function deleteWidget(widgetId, pageId, websiteId, userId) {
            var widget = WidgetService.findWidgetById(widgetId);

            if (widget != null) {
                //console.log(widget);
                WidgetService.deleteWidget(widgetId);
            }
            $location.url("/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget");
        }
    }
})();