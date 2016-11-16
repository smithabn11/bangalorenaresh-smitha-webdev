/**
 * Created by smitha on 11/11/16.
 */
module.exports = function () {

    var connectionString = 'mongodb://localhost/bangalorenaresh-assignment';

    if(process.env.MONGO_LAB_PASSWORD) {
        connectionString = process.env.MONGO_LAB_USER + ":" +
            process.env.MONGO_LAB_PASSWORD + "@" +
            "ds151927.mlab.com:51927" + "/" + process.env.MONGO_LAB_ASSIGNMENT_DB
    }

    var mongoose = require("mongoose");
    mongoose.createConnection(connectionString);

    return {
        userModel: require("./user/user.model.server.js")(),
        websiteModel: require("./website/website.model.server.js")(),
        pageModel: require("./page/page.model.server.js")(),
        widgetModel: require("./widget/widget.model.server.js")()
    };
}