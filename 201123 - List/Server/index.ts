import fastify from 'fastify';
import * as fastifyMongodb from 'fastify-mongodb';
import cors from 'fastify-cors'
import { ObjectId } from 'mongodb';
import { ListIdParams } from './models/ListIdParams';
import { List } from './models/Lists';

const app = fastify({
    logger: true,
    ignoreTrailingSlash: true
});

app.register(fastifyMongodb.default, {
    forceClose: true,
    url: '/mongodb://localhost:27017/to-do-list'
});

app.register(cors);

app.get('/api/lists/', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("lists");

    collection.find({}).toArray((error, items) =>{
        if(error){
            reply.status(401).send({
                result: false,
                message: "Error: GET fallita!",
                error: error.message
            });
        }else{
            reply.status(200).send({
                result: true,
                items
            });
        }
    })
});

app.get<{ Params: ListIdParams }>('/api/lists/:_id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("lists");

    collection.findOne({ _id: new ObjectId(request.params._id) }, (error, item) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: GET fallita!",
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

app.post('/api/insert/', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("lists");

    let newUser = request.body as List;

    collection.insertOne(newUser, (error, item) =>{
        if(error){
            reply.status(401).send({
                result: false,
                message: "Error: POST fallita!",
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

app.put<{ Params: ListIdParams }>('/api/modify/:_id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("lists");

    let listToModify = request.body as List;
    console.log(listToModify);
    listToModify._id = new ObjectId(listToModify._id) as any;
    collection.updateOne({ _id: new ObjectId(request.params._id) }, { $set: listToModify }, (error, item) =>{
        if(error){
            reply.status(500).send({
                result: false,
                message: new ObjectId(request.params._id),
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

app.delete<{ Params: ListIdParams }>('/api/delete/:_id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("lists");

    collection.deleteOne({ _id: new ObjectId(request.params._id) }, (error, item) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: DELETE fallita!",
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