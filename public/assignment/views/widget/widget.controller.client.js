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

    function NewWidgetController($routeParams, $location, WidgetService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];
        var pageId = $routeParams['pid'];


        vm.userId = userId;
        vm.websiteId = websiteId;
        vm.pageId = pageId;
        vm.createWidget = createWidget;

        function createWidget(widgetType) {
            var newWidget = {
                _id: (new Date()).getTime() + "",
                widgetType: widgetType,
                pageId: vm.pageId
            };
            console.log(newWidget);
            WidgetService.createWidget(vm.pageId, newWidget);
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + newWidget._id);
        }
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
        vm.updateWidgetHeader = updateWidgetHeader;
        vm.updateWidgetHtml = updateWidgetHtml;
        vm.updateYoutubeImage = updateYoutubeImage;

        function updateWidgetHeader(widgetId, name, text, size) {
            var widget = WidgetService.findWidgetById(widgetId);

            if (widget != null) {
                widget.name = name;
                widget.text = text;
                widget.size = size;

                WidgetService.updateWidget(widgetId, widget);
            }
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
        }

        function updateWidgetHtml(widgetId, name) {
            var widget = WidgetService.findWidgetById(widgetId);

            if (widget != null) {
                widget.text = name;
                WidgetService.updateWidget(widgetId, widget);
            }
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
        }

        function updateYoutubeImage(widgetId, name, url, width) {
            var widget = WidgetService.findWidgetById(widgetId);

            if (widget != null) {
                widget.text = name;
                widget.url = url;
                widget.width = width;

                WidgetService.updateWidget(widgetId, widget);
            }
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
        }

        function deleteWidget(widgetId) {
            var widget = WidgetService.findWidgetById(widgetId);

            if (widget != null) {
                //console.log(widget);
                WidgetService.deleteWidget(widgetId);
            }
            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
        }
    }
})();