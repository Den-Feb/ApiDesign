"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fastify_1 = require("fastify");
var fastifyMongodb = require("fastify-mongodb");
var jwt = require("fastify-jwt");
var bcrypt = require("bcrypt");
var mongodb_1 = require("mongodb");
var tokenPayload_1 = require("./models/tokenPayload");
var accomodation_1 = require("./models/accomodation");
var fastify_swagger_1 = require("fastify-swagger");
var saltRound = 10;
var app = fastify_1["default"]({
    logger: true,
    ignoreTrailingSlash: true
});
app.register(fastifyMongodb["default"], {
    forceClose: true,
    url: '/mongodb://localhost:27017/Structure'
});
app.register(fastify_swagger_1["default"], {
    routePrefix: '/documentation',
    swagger: {
        info: {
            title: 'API Design Exam',
            description: 'Swagger Exam',
            version: '0.1.0'
        },
        externalDocs: {
            url: '',
            description: 'Exam'
        },
        host: 'localhost:3000',
        schemes: ['http']
    },
    exposeRoute: true
});
app.register(jwt, {
    secret: 'supersecret'
});
var registerJsonSchema = {
    type: 'object',
    required: ['username', 'password', 'address', 'name', 'city'],
    properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        address: { type: 'string' },
        name: { type: 'string' },
        city: { type: 'string' }
    }
};
// Registro l'utente
app.post("/api/accommodation/register", {
    schema: {
        body: registerJsonSchema
    }
}, function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("accomodations");
    var registerAccomodation = request.body;
    bcrypt.hash(registerAccomodation.password, saltRound).then(function (value) {
        var accomodatin = new accomodation_1.Accomodation();
        accomodatin.username = registerAccomodation.username;
        accomodatin.password = value;
        accomodatin.address = registerAccomodation.address;
        accomodatin.name = registerAccomodation.name;
        accomodatin.city = registerAccomodation.city;
        collection.insertOne(accomodatin, function (error, item) {
            if (error) {
                reply.status(500).send({
                    result: false,
                    message: "Error: failed POST!",
                    error: error.message
                });
            }
            else {
                reply.status(201).send({
                    result: true,
                    item: item
                });
            }
        });
    })["catch"](function (error) {
        reply.status(500).send({
            result: false,
            message: "Error: calculating the password hash!",
            error: error.message
        });
    });
});
var tokenJsonSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
        username: { type: 'string', minLength: 2 },
        password: { type: 'string', minLength: 2 }
    }
};
// Verifico i dati forniti dall'utente
app.post("/api/token", {
    schema: { body: tokenJsonSchema }
}, function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("accomodations");
    var tokenRequest = request.body;
    var accomodatin;
    collection.find({}).toArray(function (error, items) {
        accomodatin = items.find(function (item) { return item.username == tokenRequest.username; });
        if (accomodatin != undefined) {
            bcrypt.compare(tokenRequest.password, accomodatin.password).then(function (result) {
                if (result == true) {
                    var payload = new tokenPayload_1.TokenPayload(accomodatin.username, accomodatin.password, accomodatin.address, accomodatin.name, accomodatin.city);
                    var token = app.jwt.sign({ payload: payload });
                    reply.status(200).send({
                        result: true,
                        token: token
                    });
                }
            });
        }
        else {
            reply.status(401).send({
                result: false,
                message: "Error: Wrong USERNAME or PASSWORD!",
                error: error.message
            });
        }
    });
});
app.register(function (fastify, otps) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        fastify.addHook("onRequest", function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, request.jwtVerify()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        reply.send({
                            result: false,
                            error: error_1.message
                        });
                        return [3 /*break*/, 3];
                    case 3:
                        fastify.get("/api/time", function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
                            var jwPayload;
                            return __generator(this, function (_a) {
                                jwPayload = request.user;
                                return [2 /*return*/, {
                                        now: new Date(),
                                        user: jwPayload
                                    }];
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
//---------------------------------------API-------------------------------------
app.get("/api/:accommodationId/booking", function (request, reply) {
    var token = app.jwt.verify(request.headers.authorization);
    var db = app.mongo.db;
    var collection = db.collection("bookings");
    collection.find({ accomodationId: request.params.accommodationId }).toArray(function (error, items) {
        if (error) {
            reply.status(500).send({
                result: false,
                message: "Error: failed GET!",
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
app.get("/api/:accommodationId/booking/:id", function (request, reply) {
    var token = app.jwt.verify(request.headers.authorization);
    var db = app.mongo.db;
    var collection = db.collection("bookings");
    collection.findOne({ accomodationId: request.params.accommodationId, _id: new mongodb_1.ObjectId(request.params.id) }, function (error, item) {
        if (error) {
            reply.status(500).send({
                result: false,
                message: "Error: failed GET!",
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
app.post("/api/:accommodationId/booking/", function (request, reply) {
    var token = app.jwt.verify(request.headers.authorization);
    var db = app.mongo.db;
    var collection = db.collection("bookings");
    var newBooking;
    newBooking = request.body;
    newBooking.accomodationId = request.params.accommodationId;
    collection.insertOne(newBooking, function (error, item) {
        if (error) {
            reply.status(500).send({
                result: false,
                message: "Error: failed POST!",
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
app.put("/api/:accommodationId/booking/:id", function (request, reply) {
    var token = app.jwt.verify(request.headers.authorization);
    var db = app.mongo.db;
    var collection = db.collection("bookings");
    var bookingModified = request.body;
    collection.updateOne({ accomodationId: request.params.accommodationId, _id: new mongodb_1.ObjectId(request.params.id) }, { $set: bookingModified }, function (error, item) {
        if (error) {
            reply.status(500).send({
                result: false,
                message: "Error: failed PUT!",
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
app["delete"]("/api/:accommodationId/booking/:id", function (request, reply) {
    var token = app.jwt.verify(request.headers.authorization);
    var db = app.mongo.db;
    var collection = db.collection("bookings");
    collection.deleteOne({ accomodationId: request.params.accommodationId, _id: new mongodb_1.ObjectId(request.params.id) }, function (error, item) {
        if (error) {
            reply.status(500).send({
                result: false,
                message: "Error: failed DELETE!",
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
