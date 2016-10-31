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

        function init() {
            var promise = WidgetService.findWidgetsByPageId(userId, websiteId, pageId);

            promise
                .success(function (widgets) {
                    if (widgets != '0') {
                        vm.widgets = widgets;
                        vm.userId = userId;
                        vm.websiteId = websiteId;
                        vm.pageId = pageId;
                        vm.checkSafeHtml = checkSafeHtml;
                        vm.checkSafeYoutubeUrl = checkSafeYoutubeUrl;
                    }
                })
                .error(function () {

                });
        }

        init();

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

        function init() {
            vm.userId = userId;
            vm.websiteId = websiteId;
            vm.pageId = pageId;
            vm.createWidget = createWidget;
        }

        init();

        function createWidget(widgetType) {
            var newWidget = {
                _id: (new Date()).getTime() + "",
                widgetType: widgetType,
                pageId: vm.pageId
            };
            WidgetService.createWidget(vm.userId, vm.websiteId, vm.pageId, newWidget);

            $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + newWidget._id);
        }
    }

    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;

        var userId = $routeParams['uid'];
        var websiteId = $routeParams['wid'];
        var pageId = $routeParams['pid'];
        var widgetId = $routeParams['wgid'];

        function init() {
            var promise = WidgetService.findWidgetById(userId, websiteId, pageId, widgetId);
            promise
                .success(function (widget) {
                    if (widget != '0') {
                        vm.userId = userId;
                        vm.websiteId = websiteId;
                        vm.pageId = pageId;
                        vm.widgetId = widgetId;
                        vm.widget = widget;
                        vm.deleteWidget = deleteWidget;
                        vm.updateWidget = updateWidget;
                    }
                })
                .error(function () {

                });
        }

        init();

        function updateWidget(widget) {
            if (widget != null) {
                WidgetService.updateWidget(vm.userId, vm.websiteId, vm.pageId, widget)
                    .success(function () {
                        $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                    })
                    .error(function () {

                    })
            }
        }

        function deleteWidget(widgetId) {
            WidgetService.deleteWidget(vm.userId, vm.websiteId, vm.pageId, widgetId)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                })
                .error(function () {

                })
        }
    }
})();