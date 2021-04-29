"use strict";
exports.__esModule = true;
var fastify_1 = require("fastify");
var fastifyMongodb = require("fastify-mongodb");
var mongodb_1 = require("mongodb");
var path = require("path");
var app = fastify_1["default"]({
    logger: true,
    ignoreTrailingSlash: true
});
app.register(fastifyMongodb["default"], {
    forceClose: true,
    url: '/mongodb://localhost:27017/Products'
});
app.register(require('pointOfView'), {
    engine: {
        ejs: require('ejs')
    }
});
app.register(require('fastify-static'), {
    root: path.join(__dirname, 'css'),
    prefix: '/css/'
});
app.register(require('fastify-static'), {
    root: path.join(__dirname, 'scripts'),
    prefix: '/scripts/',
    decorateReply: false
});
app.get('/', function (request, reply) {
    try {
        reply.status(200).view('/templates/home.ejs');
    }
    catch (err) {
        reply.status(404).send({
            result: false,
            err: err.message
        });
    }
});
app.get('/api/products', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Product");
    collection.find({}).toArray(function (error, products) {
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
                products: products
            });
        }
    });
});
app.get('/api/products/:id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Product");
    collection.findOne({ _id: new mongodb_1.ObjectId(request.params.id) }, function (error, products) {
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
                products: products
            });
        }
    });
});
app.post('/api/products', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Product");
    var newProducts = request.body;
    collection.insertOne(newProducts, function (error, products) {
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
                products: products
            });
        }
    });
});
app.put('/api/products/:id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Product");
    var updateProducts = request.body;
    collection.updateOne({ _id: new mongodb_1.ObjectId(request.params.id) }, { $set: updateProducts }, function (error, products) {
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
                products: products
            });
        }
    });
});
app["delete"]('/api/products/:id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Product");
    collection.deleteOne({ _id: new mongodb_1.ObjectId(request.params.id) }, function (error, products) {
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
                products: products
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
