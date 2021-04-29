"use strict";
exports.__esModule = true;
var fastify_1 = require("fastify");
var fastifyMongodb = require("fastify-mongodb");
var fastify_cors_1 = require("fastify-cors");
var app = fastify_1["default"]({
    logger: true,
    ignoreTrailingSlash: true
});
app.register(fastifyMongodb["default"], {
    forceClose: true,
    url: '/mongodb://localhost:27017/e-commerce'
});
app.register(fastify_cors_1["default"]);
app.get("/api/products", function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Prodotto");
    collection.find({}).toArray(function (error, items) {
        if (error) {
            reply.status(401).send({
                result: false,
                message: "Error: GET failed!",
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
app.get("/api/baskets", function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Carrello");
    collection.find({}).toArray(function (error, items) {
        if (error) {
            reply.status(401).send({
                result: false,
                message: "Error: GET failed!",
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
app.post("/api/baskets", function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("Carrello");
    var newBasket = request.body;
    collection.insertOne(newBasket, function (error, item) {
        if (error) {
            reply.status(401).send({
                result: false,
                message: "Error: POST failed!",
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
