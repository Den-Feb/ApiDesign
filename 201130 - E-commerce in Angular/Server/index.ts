import fastify from 'fastify';
import * as fastifyMongodb from 'fastify-mongodb';
import cors from 'fastify-cors'
import { ObjectId } from 'mongodb';
import { Basket } from './models/basket';

const app = fastify({
    logger: true,
    ignoreTrailingSlash: true
});

app.register(fastifyMongodb.default, {
    forceClose: true,
    url: '/mongodb://localhost:27017/e-commerce'
});

app.register(cors);

app.get("/api/products", (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Prodotto");

    collection.find({}).toArray((error, items) =>{
        if(error){
            reply.status(401).send({
                result: false,
                message: "Error: GET failed!",
                error: error.message
            });
        }else{
            reply.status(200).send({
                result: true,
                items
            });
        }
    });
});

app.get("/api/baskets", (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Carrello");

    collection.find({}).toArray((error, items) =>{
        if(error){
            reply.status(401).send({
                result: false,
                message: "Error: GET failed!",
                error: error.message
            });
        }else{
            reply.status(200).send({
                result: true,
                items
            });
        }
    });
});

app.post("/api/baskets", (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Carrello");

    let newBasket = request.body as Basket;

    collection.insertOne(newBasket, (error, item) =>{
        if(error){
            reply.status(401).send({
                result: false,
                message: "Error: POST failed!",
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