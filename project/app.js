/**
 * Created by smitha on 10/24/16.
 */

module.exports = function(app) {
    require("./services/shopper.service.server.js")(app);
    require("./services/search.service.server.js")(app);
};