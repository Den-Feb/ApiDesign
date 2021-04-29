"use strict";
exports.__esModule = true;
var fastify_1 = require("fastify");
var fastifyMongodb = require("fastify-mongodb");
var mongodb_1 = require("mongodb");
var fastify_formbody_1 = require("fastify-formbody");
var fastify_static_1 = require("fastify-static");
var point_of_view_1 = require("point-of-view");
var path = require("path");
var app = fastify_1["default"]({
    logger: true,
    ignoreTrailingSlash: true
});
app.register(fastify_formbody_1["default"]);
app.register(fastifyMongodb["default"], {
    forceClose: true,
    url: '/mongodb://localhost:27017/User'
});
app.register(point_of_view_1["default"], {
    engine: {
        ejs: require('ejs')
    }
});
app.register(fastify_static_1["default"], {
    root: path.join(__dirname, 'css'),
    prefix: '/css/'
});
app.register(fastify_static_1["default"], {
    root: path.join(__dirname, 'script'),
    prefix: '/script/',
    decorateReply: false
});
app.get('/api/', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Users");
    collection.find({}).toArray(function (error, items) {
        if (error) {
            reply.status(401).send({
                result: false,
                message: "Error: GET fallita!",
                error: error.message
            });
        }
        else {
            reply.status(200).view('/templates/home.ejs', {
                users: items
            });
        }
    });
});
app.get('/api/Users/', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Users");
    collection.find({}).toArray(function (error, items) {
        if (error) {
            reply.status(401).send({
                result: false,
                message: "Error: GET fallita!",
                error: error.message
            });
        }
        else {
            reply.status(200).view('/templates/list.ejs', {
                users: items
            });
        }
    });
});
app.get('/api/Users/:_id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Users");
    collection.findOne({ _id: new mongodb_1.ObjectId(request.params._id) }, function (error, item) {
        if (error) {
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error
            });
        }
        else {
            reply.status(200).view('/templates/details.ejs', item);
        }
    });
});
app.get('/api/InsertUser/', function (request, reply) {
    try {
        reply.status(200).view('/templates/insert.ejs');
    }
    catch (err) {
        reply.status(401).send({
            result: false,
            err: err.message
        });
    }
});
app.post('/api/InsertUser/', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Users");
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
            reply.redirect(200, "/api/");
        }
    });
});
app.get('/api/ModifyUser/:_id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Users");
    collection.findOne({ _id: new mongodb_1.ObjectId(request.params._id) }, function (error, item) {
        if (error) {
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error
            });
        }
        else {
            reply.status(200).view('/templates/modify.ejs', item);
        }
    });
});
app.post('/api/ModifyUser/:_id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Users");
    var userToModify = request.body;
    collection.updateOne({ _id: new mongodb_1.ObjectId(request.params._id) }, { $set: userToModify }, function (error, item) {
        if (error) {
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
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
app.get('/api/DeleteUser/:_id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Users");
    collection.findOne({ _id: new mongodb_1.ObjectId(request.params._id) }, function (error, item) {
        if (error) {
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error
            });
        }
        else {
            reply.status(200).view('/templates/delete.ejs', item);
        }
    });
});
app.post('/api/DeleteUser/:_id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Users");
    collection.deleteOne({ _id: new mongodb_1.ObjectId(request.params._id) }, function (error, item) {
        if (error) {
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
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
