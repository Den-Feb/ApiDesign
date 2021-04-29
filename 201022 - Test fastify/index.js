"use strict";
exports.__esModule = true;
var fastify_1 = require("fastify");
var mysql = require("mysql");
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
app.get('/', function (request, reply) {
    connection.query("SELECT * FROM user", function (error, results, fields) {
        if (error) {
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error
            });
        }
        else {
            reply.status(200).send({
                result: true,
                results: results
            });
        }
    });
});
app.get("/api/users/:id", function (request, reply) {
    var userId = request.params.id;
    connection.query("SELECT * FROM user WHERE id = ?", [userId], function (error, results, fields) {
        if (error) {
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error
            });
        }
        else {
            reply.status(200).send({
                result: true,
                results: results
            });
        }
    });
});
app.post("/api/users", function (request, reply) {
    var users = request.body;
    connection.query("INSERT INTO user VALUES(?,?,?,?)", [users.id, users.firstname], function (error, results, fields) {
        if (error) {
            reply.status(404).send({
                result: false,
                message: "Error: Post fallita!",
                error: error
            });
        }
        else {
            reply.status(200).send({
                result: true,
                results: results
            });
        }
    });
});
app.put("/api/users/:id", function (request, reply) {
    var userId = request.params.id;
    var users = request.body;
    connection.query("UPDATE user SET firstname = ?, lastname = ?, age = ? WHERE id = ?", [users.firstname, users.lastname, users.age, userId], function (error, results, fields) {
        if (error) {
            reply.status(404).send({
                result: false,
                message: "Error: Put fallita!",
                error: error
            });
        }
        else {
            reply.status(200).send({
                result: true,
                message: "Modificato!",
                results: results
            });
        }
    });
});
app["delete"]("/api/users/:id", function (request, reply) {
    var userId = request.params.id;
    connection.query("DELETE FROM user WHERE id = ?", [userId], function (error, results, fields) {
        if (error) {
            reply.status(404).send({
                result: false,
                message: "Error: Delete fallita!",
                error: error
            });
        }
        else {
            reply.status(200).send({
                result: true,
                message: "Cancellato!",
                results: results
            });
        }
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
var Users = /** @class */ (function () {
    function Users(id, firstname, lastname, age) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.age = age;
    }
    return Users;
}());
