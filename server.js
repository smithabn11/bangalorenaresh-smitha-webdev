var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// require ("./test/app.js")(app);
require ("./assignment/app.js")(app);
require ("./project/app.js")(app);

// var path = require('path');
// var http = require("http");
// var url = require("url");
// var req = require('request')
// var pem = require('pem');
// var cors = require("cors");



var port      = process.env.PORT || 3000;

app.listen(port);

// app.options('*', cors());
//
// app.all('/*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header("Access-Control-Allow-Headers", "X-Requested-With,     Content-Type");
//     next();
// });
//
// app.get('/', function (req, res) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end(contents);
// });
