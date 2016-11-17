/**
 * Created by smitha on 11/11/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var WidgetSchema = mongoose.Schema({
        _page : {type: mongoose.Schema.ObjectId, ref : 'PageModel'},
        widgetType: {type: String, enum : ['HEADER', 'IMAGE', 'YOUTUBE', 'HTML', 'INPUT']},
        name : String,
        text: String,
        placeholder: String,
        description : String,
        url: String,
        width: String,
        height: String,
        rows: Number,
        size: Number,
        class: String,
        icon: String,
        deletable: Boolean,
        formatted: Boolean,
        displayOrder: Number,
        dateCreated: {type: Date, default: Date.now}
    });
    return WidgetSchema;
}