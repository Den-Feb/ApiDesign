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
var fastify_cors_1 = require("fastify-cors");
var jwt = require("fastify-jwt");
var bcrypt = require("bcrypt");
var mongodb_1 = require("mongodb");
var user_1 = require("./models/user");
var tokenPayload_1 = require("./models/tokenPayload");
var responseWrapper_1 = require("./models/responseWrapper");
var saltRound = 10;
var app = fastify_1["default"]({
    logger: true,
    ignoreTrailingSlash: true
});
app.register(fastifyMongodb["default"], {
    forceClose: true,
    url: '/mongodb://localhost:27017/kitchen'
});
app.register(fastify_cors_1["default"]);
app.register(jwt, {
    secret: 'supersecret'
});
//----------------------------------------------AUTENTICATION----------------------------------------------------
// Registro l'utente
app.post("/api/register", function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("user");
    var registerUser = request.body;
    bcrypt.hash(registerUser.password, saltRound).then(function (value) {
        var user = new user_1.User();
        user.username = registerUser.username;
        user.password = value;
        user.email = registerUser.email;
        user.name = registerUser.name;
        user.surname = registerUser.surname;
        collection.insertOne(user, function (error, item) {
            if (error) {
                reply.send(new responseWrapper_1.ResponseWrapper(false, 500, "Error: POST failed!", null, null, error.message));
            }
            else {
                reply.send(new responseWrapper_1.ResponseWrapper(true, 200, "Operation went well", item, null, null));
            }
        });
    })["catch"](function (error) {
        reply.send(new responseWrapper_1.ResponseWrapper(false, 500, "Error: REGISTRATION failed!", null, null, error.message));
    });
});
// Verifico i dati forniti dall'utente
app.post("/api/token", function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("user");
    var tokenRequest = request.body;
    var user;
    collection.find({}).toArray(function (error, items) {
        user = items.find(function (item) { return item.username == tokenRequest.username; });
        if (user != undefined) {
            bcrypt.compare(tokenRequest.password, user.password).then(function (result) {
                if (result == true) {
                    var payload = new tokenPayload_1.TokenPayload(user.username, user.email, user.name, user.surname);
                    var token = app.jwt.sign({ payload: payload });
                    reply.send(new responseWrapper_1.ResponseWrapper(true, 200, "Operation went well", token, null, null));
                }
            });
        }
        else {
            reply.send(new responseWrapper_1.ResponseWrapper(false, 500, "Error: AUTENTICATION failed!", null, null, error.message));
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
//----------------------------------------------API REQUEST----------------------------------------------------
app.get('/api/recipes', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("recipe");
    collection.find({}).toArray(function (error, items) {
        if (error) {
            reply.send(new responseWrapper_1.ResponseWrapper(false, 500, "Error: GET failed!", null, null, error.message));
        }
        else {
            reply.send(new responseWrapper_1.ResponseWrapper(true, 200, "Operation went well", null, items, null));
        }
    });
});
app.get('/api/recipes/:id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("recipe");
    collection.findOne({ _id: new mongodb_1.ObjectId(request.params.id) }, function (error, items) {
        if (error) {
            reply.send(new responseWrapper_1.ResponseWrapper(false, 500, "Error: GET failed!", null, null, error.message));
        }
        else {
            reply.send(new responseWrapper_1.ResponseWrapper(true, 200, "Operation went well", null, items, null));
        }
    });
});
app.get('/api/recipes?author=', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("recipe");
    collection.findOne({ author: request.params.author }, function (error, items) {
        console.log("Autore: " + request.params.author);
        if (error) {
            reply.send(new responseWrapper_1.ResponseWrapper(false, 500, "Error: GET failed!", null, null, error.message));
        }
        else {
            reply.send(new responseWrapper_1.ResponseWrapper(true, 200, "Operation went well", null, items, null));
        }
    });
});
app.post('/api/recipes', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("recipe");
    var newRecipe = request.body;
    collection.insertOne(newRecipe, function (error, item) {
        if (error) {
            reply.send(new responseWrapper_1.ResponseWrapper(false, 500, "Error: POST failed!", null, null, error.message));
        }
        else {
            reply.send(new responseWrapper_1.ResponseWrapper(true, 200, "Operation went well", item, null, null));
        }
    });
});
app.put('/api/recipes/:id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("recipe");
    var RecpeToModify = request.body;
    RecpeToModify._id = new mongodb_1.ObjectId(RecpeToModify._id);
    collection.updateOne({ _id: new mongodb_1.ObjectId(request.params.id) }, { $set: RecpeToModify }, function (error, item) {
        if (error) {
            reply.send(new responseWrapper_1.ResponseWrapper(false, 500, "Error: PUT failed!", null, null, error.message));
        }
        else {
            reply.send(new responseWrapper_1.ResponseWrapper(true, 200, "Operation went well", item, null, null));
        }
    });
});
app["delete"]('/api/recipes/:id', function (request, reply) {
    var db = app.mongo.db;
    var collection = db.collection("recipe");
    collection.deleteOne({ _id: new mongodb_1.ObjectId(request.params.id) }, function (error, item) {
        if (error) {
            reply.send(new responseWrapper_1.ResponseWrapper(false, 500, "Error: DELETE failed!", null, null, error.message));
        }
        else {
            reply.send(new responseWrapper_1.ResponseWrapper(true, 200, "Operation went well", item, null, null));
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
