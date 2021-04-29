import fastify from 'fastify';
import * as fastifyMongodb from 'fastify-mongodb';
import { ObjectId } from 'mongodb';
import { User } from './models/User';
import { UserIdParams } from './models/UserIdParams';
import fastifyFormbody from 'fastify-formbody';
import fastifyStatic from 'fastify-static';
import pointOfView from 'point-of-view';
import * as path from 'path';

const app = fastify({
    logger: true,
    ignoreTrailingSlash: true
});

app.register(fastifyFormbody);

app.register(fastifyMongodb.default, {
    forceClose: true,
    url: '/mongodb://localhost:27017/User'
});

app.register(pointOfView, {
    engine: {
        ejs: require('ejs')
    }
});

app.register(fastifyStatic, {
    root: path.join(__dirname, 'css'),
    prefix: '/css/',
});

app.register(fastifyStatic, {
    root: path.join(__dirname, 'script'),
    prefix: '/script/',
    decorateReply: false
});

app.get('/api/', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Users");

    collection.find({}).toArray((error, items) =>{
        if(error){
            reply.status(401).send({
                result: false,
                message: "Error: GET fallita!",
                error: error.message
            });
        }else{
            reply.status(200).view('/templates/home.ejs', {
                users: items
            });
        }
    })
});

app.get('/api/Users/', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Users");

    collection.find({}).toArray((error, items) =>{
        if(error){
            reply.status(401).send({
                result: false,
                message: "Error: GET fallita!",
                error: error.message
            });
        }else{
            reply.status(200).view('/templates/list.ejs', {
                users: items
            });
        }
    })
});

app.get<{ Params: UserIdParams }>('/api/Users/:_id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Users");

    collection.findOne({ _id: new ObjectId(request.params._id) }, (error, item) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error
            });
        }else{
            reply.status(200).view('/templates/details.ejs', item);
        }
    });
});

app.get('/api/InsertUser/', (request, reply) =>{
    try {
        reply.status(200).view('/templates/insert.ejs');
    } catch (err) {
        reply.status(401).send({
            result: false,
            err: err.message
        });
    }
});

app.post('/api/InsertUser/', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Users");

    let newUser = request.body as User;

    collection.insertOne(newUser, (error, item) =>{
        if(error){
            reply.status(401).send({
                result: false,
                message: "Error: POST fallita!",
                error: error.message
            });
        }else{
            reply.redirect(200, "/api/");
        }
    });
});

app.get<{ Params: UserIdParams }>('/api/ModifyUser/:_id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Users");

    collection.findOne({ _id: new ObjectId(request.params._id) }, (error, item) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error
            });
        }else{
            reply.status(200).view('/templates/modify.ejs', item);
        }
    });
});

app.post<{ Params: UserIdParams }>('/api/ModifyUser/:_id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Users");

    let userToModify = request.body as User;

    collection.updateOne({ _id: new ObjectId(request.params._id) }, { $set: userToModify }, (error, item) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error.message
            });
        }else{
            reply.status(200).send({ 
                result: true,
                item
            });
        }
    });
});

app.get<{ Params: UserIdParams }>('/api/DeleteUser/:_id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Users");

    collection.findOne({ _id: new ObjectId(request.params._id) }, (error, item) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error
            });
        }else{
            reply.status(200).view('/templates/delete.ejs', item);
        }
    });
});

app.post<{ Params: UserIdParams }>('/api/DeleteUser/:_id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Users");

    collection.deleteOne({ _id: new ObjectId(request.params._id) }, (error, item) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error.message
            });
        }else{
            reply.status(200).send({ 
                result: true,
                item
            });
        }
    });
});

app.listen(3000, (error, address) =>{
    if(error){
        app.log.error(error.message);
        process.exit(1);
    }else{
        app.log.info(`server listening on ${address}`);
    }
})