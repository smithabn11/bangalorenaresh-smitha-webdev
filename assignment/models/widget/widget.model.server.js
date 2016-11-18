/**
 * Created by smitha on 11/11/16.
 */
module.exports = function (mongoose) {
    var mongoose = require("mongoose");
    var WidgetSchema = require("./widget.schema.server.js")();
    var WidgetModel = mongoose.model("WidgetModel", WidgetSchema);

    var api = {
        createWidget: createWidget,
        findWidgetById: findWidgetById,
        findWidgetsByPageId: findWidgetsByPageId,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidgets: reorderWidgets,
        findNextDisplayOrder: findNextDisplayOrder
    }

    return api;

    function createWidget(pageId, widget) {
        widget._page = pageId;
        return WidgetModel.create(widget);
    }

    function findWidgetById(widgetId) {
        return WidgetModel.findById(widgetId);
    }

    function findWidgetsByPageId(pageId) {
        return WidgetModel.find({_page: pageId});
    }

    function updateWidget(widgetId, widget) {
        delete widget._id;
        return WidgetModel.update({_id: widgetId}, {$set: widget});
    }

    function deleteWidget(widgetId) {
        return WidgetModel.remove({_id: widgetId});
    }

    function findNextDisplayOrder(pageId) {
        return WidgetModel.find({_page: pageId}).sort({displayOrder: -1}).findOne().exec();
    }

    function reorderWidgets(pageId, start, end) {
        start = parseInt(start);
        end = parseInt(end);

        return WidgetModel
            .find({_page: pageId})
            .sort({displayOrder: 1})
            .then(function (widgets) {
                var prevDisplayOrder = -1;
                if (start < end) {
                    for (index = 0; index < widgets.length; index++) {
                        if (index == start) {
                            prevDisplayOrder = widgets[index].displayOrder;
                        } else if (index > start && index <= end) {
                            var curDisplayOrder = widgets[index].displayOrder;
                            widgets[index].displayOrder = prevDisplayOrder;
                            prevDisplayOrder = curDisplayOrder;
                            if (index == end) {
                                widgets[start].displayOrder = prevDisplayOrder;
                                widgets[start].save();
                            }
                            widgets[index].save();
                        }
                    }
                } else {
                    for (index = widgets.length - 1; index >= 0; index--) {
                        if (index == start) {
                            prevDisplayOrder = widgets[index].displayOrder;
                        } else if (index < start && index >= end) {
                            var curDisplayOrder = widgets[index].displayOrder;
                            widgets[index].displayOrder = prevDisplayOrder;
                            prevDisplayOrder = curDisplayOrder;
                            if (index == end) {
                                widgets[start].displayOrder = prevDisplayOrder;
                                widgets[start].save();
                            }
                            widgets[index].save();
                        }
                    }
                }
                res.sendStatus(200);
            }, function (error) {
                res.sendStatus(404);
            });
    }
}
