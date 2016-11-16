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
        shopperModel: require("./shopper/shopper.model.server.js")(),
        adminModel: require("./admin/admin.model.server.js")(),
    };
}