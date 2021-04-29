"use strict";
exports.__esModule = true;
var fastify_1 = require("fastify");
var mysql = require("mysql");
var ResponseWrapper_1 = require("./models/ResponseWrapper");
var app = fastify_1["default"]({
    logger: true,
    ignoreTrailingSlash: true
});
var connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'php1234',
    database: 'Test201019'
});
var respons = new ResponseWrapper_1.ResponseWrapper();
function getAllUsers() {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM user", function (error, results, fields) {
            if (error) {
                respons.result = false;
                respons.errors = error.message;
                respons.status = 401;
                reject(respons);
                return;
            }
            respons.result = true;
            respons.data = results;
            respons.status = 200;
            resolve(respons);
        });
    });
}
function insertUser(user) {
    return new Promise(function (resolve, reject) {
        connection.query("INSERT INTO user VALUES(?,?,?,?)", [user.id, user.firstname, user.lastname, user.age], function (error, results, fields) {
            if (error) {
                respons.result = false;
                respons.errors = error.message;
                respons.status = 401;
                reject(respons);
                return;
            }
            respons.result = true;
            respons.data = results;
            respons.status = 200;
            resolve(respons);
        });
    });
}
app.get('/', function (request, reply) {
    getAllUsers().then(function (queryData) {
        reply.status(queryData.status).send({
            result: queryData.status,
            message: queryData.data
        });
    }, function (error) {
        reply.status(error.status).send({
            result: error.status,
            error: error.errors
        });
    });
});
app.post('/api/user', function (request, reply) {
    var user = request.body;
    insertUser(user).then(function (queryData) {
        reply.status(queryData.status).send({
            result: queryData.status,
            message: queryData.data
        });
    }, function (error) {
        reply.status(error.status).send({
            result: error.status,
            error: error.errors
        });
    });
});
app.listen(3000, function (error, address) {
    if (error) {
        app.log.error(error);
        process.exit(1);
    }
    else {
        app.log.info("server listening on " + address);
    }
});
