"use strict";
exports.__esModule = true;
var fastify_1 = require("fastify");
var fastifyMongodb = require("fastify-mongodb");
var fastify_cors_1 = require("fastify-cors");
var mongodb_1 = require("mongodb");
var app = fastify_1["default"]({
    logger: true,
    ignoreTrailingSlash: true
});
app.register(fastifyMongodb["default"], {
    forceClose: true,
    url: '/mongodb://localhost:27017/to-do-list'
});
app.register(fastify_cors_1["default"]);
app.get('/api/lists/', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("lists");
    collection.find({}).toArray(function (error, items) {
        if (error) {
            reply.status(401).send({
                result: false,
                message: "Error: GET fallita!",
                error: error.message
            });
        }
        else {
            reply.status(200).send({
                result: true,
                items: items
            });
        }
    });
});
app.get('/api/lists/:_id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("lists");
    collection.findOne({ _id: new mongodb_1.ObjectId(request.params._id) }, function (error, item) {
        if (error) {
            reply.status(404).send({
                result: false,
                message: "Error: GET fallita!",
                error: error.message
            });
        }
        else {
            reply.status(200).send({
                result: true,
                item: item
            });
        }
    });
});
app.post('/api/insert/', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("lists");
    var newUser = request.body;
    collection.insertOne(newUser, function (error, item) {
        if (error) {
            reply.status(401).send({
                result: false,
                message: "Error: POST fallita!",
                error: error.message
            });
        }
        else {
            reply.status(200).send({
                result: true,
                item: item
            });
        }
    });
});
app.put('/api/modify/:_id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("lists");
    var listToModify = request.body;
    console.log(listToModify);
    listToModify._id = new mongodb_1.ObjectId(listToModify._id);
    collection.updateOne({ _id: new mongodb_1.ObjectId(request.params._id) }, { $set: listToModify }, function (error, item) {
        if (error) {
            reply.status(500).send({
                result: false,
                message: new mongodb_1.ObjectId(request.params._id),
                error: error.message
            });
        }
        else {
            reply.status(200).send({
                result: true,
                item: item
            });
        }
    });
});
app["delete"]('/api/delete/:_id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("lists");
    collection.deleteOne({ _id: new mongodb_1.ObjectId(request.params._id) }, function (error, item) {
        if (error) {
            reply.status(404).send({
                result: false,
                message: "Error: DELETE fallita!",
                error: error.message
            });
        }
        else {
            reply.status(200).send({
                result: true,
                item: item
            });
        }
    });
});
app.listen(3000, function (error, address) {
    if (error) {
        app.log.error(error.message);
        process.exit(1);
    }
    else {
        app.log.info("server listening on " + address);
    }
});
