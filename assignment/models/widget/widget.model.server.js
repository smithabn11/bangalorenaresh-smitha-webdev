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
        reorderWidget: reorderWidget
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
        return WidgetModel.find({_page : pageId});
    }

    function updateWidget(widgetId, widget) {
        delete widget._id;
        return WidgetModel.update({_id : widgetId} , {$set : widget});
    }

    function deleteWidget(widgetId) {
        return WidgetModel.remove({_id: widgetId});
    }

    function reorderWidget(pageId, start, end) {

    }
}
