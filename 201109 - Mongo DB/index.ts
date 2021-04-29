import fastify from 'fastify';
import * as fastifyMongodb from 'fastify-mongodb';
import { ObjectId } from 'mongodb';
import { ProductIdParams } from './models/ProductIdParams';
import { Products } from './models/Products';
// import * as fastifyStatic from 'fastify-static';
// import * as pointOfView from 'point-of-view';
import * as path from 'path';

const app = fastify({
    logger: true,
    ignoreTrailingSlash: true
});

app.register(fastifyMongodb.default, {
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

app.get('/', (request, reply) =>{
    try {
        reply.status(200).view('/templates/home.ejs');
    } catch (err) {
        reply.status(404).send({
            result: false,
            err: err.message
        });
    }
});

app.get('/api/products', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Product");

    collection.find({}).toArray((error, products) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error
            });
        }else{
            reply.status(200).send({ 
                result: true,
                products
            });
        }
    });
});

app.get<{ Params: ProductIdParams }>('/api/products/:id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Product");

    collection.findOne({ _id: new ObjectId(request.params.id) }, (error, products) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error
            });
        }else{
            reply.status(200).send({ 
                result: true,
                products
            });
        }
    });
});

app.post('/api/products', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Product");

    let newProducts = request.body as Products;

    collection.insertOne(newProducts, (error, products) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error.message
            });
        }else{
            reply.status(200).send({ 
                result: true,
                products
            });
        }
    });
});

app.put<{ Params: ProductIdParams }>('/api/products/:id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Product");

    let updateProducts = request.body as Products;

    collection.updateOne({ _id: new ObjectId(request.params.id) }, { $set: updateProducts }, (error, products) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error.message
            });
        }else{
            reply.status(200).send({ 
                result: true,
                products
            });
        }
    });
});

app.delete<{ Params: ProductIdParams }>('/api/products/:id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("Product");

    collection.deleteOne({ _id: new ObjectId(request.params.id) }, (error, products) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error.message
            });
        }else{
            reply.status(200).send({ 
                result: true,
                products
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