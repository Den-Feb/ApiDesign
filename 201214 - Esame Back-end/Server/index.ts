import fastify from 'fastify';
import * as fastifyMongodb from 'fastify-mongodb';
import * as jwt from 'fastify-jwt';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { RegisterRequest } from './models/registerRequest';
import { TokenRequest } from './models/tokenRequest';
import { TokenPayload } from './models/tokenPayload';
import { Accomodation } from './models/accomodation';
import { Booking } from './models/booking';
import { IdParams } from './models/idParams';

import swagger from 'fastify-swagger'

const saltRound = 10;

const app = fastify({
    logger: true,
    ignoreTrailingSlash: true
});

app.register(fastifyMongodb.default, {
    forceClose: true,
    url: '/mongodb://localhost:27017/Structure'
});

app.register(swagger, {
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
    exposeRoute: true,
});

app.register(jwt, {
    secret: 'supersecret'
});

const registerJsonSchema = {
    type: 'object',
    required: ['username', 'password', 'address', 'name', 'city'],
    properties: {
        username: {type: 'string'},
        password: {type: 'string'},
        address: {type : 'string'},
        name: {type: 'string'},
        city: {type: 'string'}
    }
}

// Registro l'utente
app.post("/api/accommodation/register", {
    schema: {
        body: registerJsonSchema
    }
}, (request, reply) => {
    const db = app.mongo.db;
    const collection = db.collection("accomodations");
    const registerAccomodation = request.body as RegisterRequest;

    bcrypt.hash(registerAccomodation.password, saltRound).then(value => {
        const accomodatin: Accomodation = new Accomodation();

        accomodatin.username = registerAccomodation.username;
        accomodatin.password = value;
        accomodatin.address = registerAccomodation.address;
        accomodatin.name = registerAccomodation.name
        accomodatin.city = registerAccomodation.city;

        collection.insertOne(accomodatin, (error, item) => {
            if (error) {
                reply.status(500).send({
                    result: false,
                    message: "Error: failed POST!",
                    error: error.message
                });
            } else {
                reply.status(201).send({
                    result: true,
                    item
                });
            }
        });
    }).catch(error => {
        reply.status(500).send({
            result: false,
            message: "Error: calculating the password hash!",
            error: error.message
        });
    });
});

const tokenJsonSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
        username: {type: 'string', minLength: 2},
        password: {type: 'string', minLength: 2},
    }
}

// Verifico i dati forniti dall'utente
app.post("/api/token", {
    schema: {body: tokenJsonSchema}
}, (request, reply) => {
    const db = app.mongo.db;
    const collection = db.collection("accomodations");

    const tokenRequest = request.body as TokenRequest;
    let accomodatin: Accomodation;

    collection.find({}).toArray((error, items) => {
        accomodatin = <Accomodation>items.find(item => item.username == tokenRequest.username);

        if (accomodatin != undefined) {
            bcrypt.compare(tokenRequest.password, accomodatin.password).then(result => {
                if (result == true) {
                    const payload: TokenPayload = new TokenPayload(
                        accomodatin.username,
                        accomodatin.password,
                        accomodatin.address,
                        accomodatin.name,
                        accomodatin.city
                    );
            const token = app.jwt.sign({ payload });

            reply.status(200).send({
                result: true,
                token
            });
        }
    });
}else {
    reply.status(401).send({
        result: false,
        message: "Error: Wrong USERNAME or PASSWORD!",
        error: error.message
    });
}
    });
});

app.register(async (fastify, otps) => {
    fastify.addHook("onRequest", async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (error) {
            reply.send({
                result: false,
                error: error.message
            });
        }

        fastify.get("/api/time", async (request, reply) => {
            let jwPayload = request.user;

            return {
                now: new Date(),
                user: jwPayload
            }
        });
    });
});

//---------------------------------------API-------------------------------------

app.get<{ Params: IdParams }>("/api/:accommodationId/booking", (request, reply)=>{
    let token= app.jwt.verify(request.headers.authorization);

    const db = app.mongo.db;
    const collection = db.collection("bookings");

    collection.find({ accomodationId: request.params.accommodationId }).toArray((error, items)=>{
        if(error){
            reply.status(500).send({
                result: false,
                message: "Error: failed GET!",
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

app.get<{ Params: IdParams }>("/api/:accommodationId/booking/:id", (request, reply)=>{
    let token= app.jwt.verify(request.headers.authorization);

    const db = app.mongo.db;
    const collection = db.collection("bookings");

    collection.findOne({ accomodationId: request.params.accommodationId, _id: new ObjectId(request.params.id) }, (error, item)=>{
        if(error){
            reply.status(500).send({
                result: false,
                message: "Error: failed GET!",
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

app.post<{ Params: IdParams }>("/api/:accommodationId/booking/", (request, reply)=>{
    let token= app.jwt.verify(request.headers.authorization);

    const db = app.mongo.db;
    const collection = db.collection("bookings");

    let newBooking: Booking;
    
    newBooking = request.body as Booking;
    newBooking.accomodationId = request.params.accommodationId;

    collection.insertOne(newBooking, (error, item) =>{
        if(error){
            reply.status(500).send({
                result: false,
                message: "Error: failed POST!",
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

app.put<{ Params: IdParams }>("/api/:accommodationId/booking/:id", (request, reply)=>{
    let token= app.jwt.verify(request.headers.authorization);

    const db = app.mongo.db;
    const collection = db.collection("bookings");

    let bookingModified = request.body as Booking;

    collection.updateOne({ accomodationId: request.params.accommodationId, _id: new ObjectId(request.params.id) }, { $set: bookingModified }, (error, item)=>{
        if(error){
            reply.status(500).send({
                result: false,
                message: "Error: failed PUT!",
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

app.delete<{ Params: IdParams }>("/api/:accommodationId/booking/:id", (request, reply)=>{
    let token= app.jwt.verify(request.headers.authorization);

    const db = app.mongo.db;
    const collection = db.collection("bookings");

    collection.deleteOne({ accomodationId: request.params.accommodationId, _id: new ObjectId(request.params.id) }, (error, item) =>{
        if(error){
            reply.status(500).send({
                result: false,
                message: "Error: failed DELETE!",
                error: error.message
            });
        }else{
            reply.status(200).send({ 
                result: true,
                item
            });
        }
    });
})

app.listen(3000, (error, address) => {
    if (error) {
        app.log.error(error.message);
        process.exit(1);
    } else {
        app.log.info(`server listening on ${address}`);
    }
});