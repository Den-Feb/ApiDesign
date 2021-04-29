import fastify from 'fastify';
import * as fastifyMongodb from 'fastify-mongodb';
import cors from 'fastify-cors'
import * as jwt from 'fastify-jwt';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { TokenRequest } from './models/tokenRequest';
import { User } from './models/user';
import { TokenPayload } from './models/tokenPayload';
import { RegisterRequest } from './models/registerRequest';
import { IdParams } from './models/idParameters';
import { Recipe } from './models/recipe';
import { AuthorParams } from './models/authorParameters';
import { ResponseWrapper } from './models/responseWrapper';

const saltRound = 10;

const app = fastify({
    logger: true,
    ignoreTrailingSlash: true
});

app.register(fastifyMongodb.default, {
    forceClose: true,
    url: '/mongodb://localhost:27017/kitchen'
});

app.register(cors);

app.register(jwt, {
    secret: 'supersecret'
});

//----------------------------------------------AUTENTICATION----------------------------------------------------

// Registro l'utente
app.post("/api/register", (request, reply)=>{
    const db = app.mongo.db;
    const collection = db.collection("user");
    const registerUser = request.body as RegisterRequest;

    bcrypt.hash(registerUser.password, saltRound).then(value=>{
        const user: User = new User();

        user.username = registerUser.username;
        user.password = value;
        user.email = registerUser.email;
        user.name = registerUser.name;
        user.surname = registerUser.surname;

        collection.insertOne(user, (error, item) =>{
            if(error){
                reply.send(new ResponseWrapper(
                    false,
                    500,
                    "Error: POST failed!",
                    null,
                    null,
                    error.message
                ));
            }else{
                reply.send(new ResponseWrapper(
                    true,
                    200,
                    "Operation went well",
                    item,
                    null,
                    null
                ));
            }
        });
    }).catch(error=>{
        reply.send(new ResponseWrapper(
            false,
            500,
            "Error: REGISTRATION failed!",
            null,
            null,
            error.message
        ));
    });
});

// Verifico i dati forniti dall'utente
app.post("/api/token", (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("user");

    const tokenRequest = request.body as TokenRequest;
    let user: User;

    collection.find({}).toArray((error, items) =>{
        user = <User>items.find(item => item.username == tokenRequest.username);
        
        if(user != undefined){
            bcrypt.compare(tokenRequest.password, user.password).then(result=>{
                if(result == true){
                    const payload: TokenPayload = new TokenPayload(
                        user.username,
                        user.email,
                        user.name,
                        user.surname
                    );
                    const token = app.jwt.sign({payload});

                    reply.send(new ResponseWrapper(
                        true,
                        200,
                        "Operation went well",
                        token,
                        null,
                        null
                    ));
                }
            });
        }else{
            reply.send(new ResponseWrapper(
                false,
                500,
                "Error: AUTENTICATION failed!",
                null,
                null,
                error.message
            ));
        }
    });
});

app.register(async (fastify, otps)=>{
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

//----------------------------------------------API REQUEST----------------------------------------------------

app.get('/api/recipes', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("recipe");

    collection.find({}).toArray((error, items) =>{
        if(error){
            reply.send(new ResponseWrapper(
                false,
                500,
                "Error: GET failed!",
                null,
                null,
                error.message
            ));
        }else{
            reply.send(new ResponseWrapper(
                true,
                200,
                "Operation went well",
                null,
                items,
                null
            ));
        }
    })
});

app.get<{ Params: IdParams }>('/api/recipes/:id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("recipe");

    collection.findOne({ _id: new ObjectId(request.params.id) }, (error, items) =>{
        if(error){
            reply.send(new ResponseWrapper(
                false,
                500,
                "Error: GET failed!",
                null,
                null,
                error.message
            ));
        }else{
            reply.send(new ResponseWrapper(
                true,
                200,
                "Operation went well",
                null,
                items,
                null
            ));
        }
    });
});

app.get<{ Params: AuthorParams }>('/api/recipes?author=', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("recipe");

    collection.findOne({ author: request.params.author }, (error, items) =>{
        console.log("Autore: "+request.params.author);
        if(error){
            reply.send(new ResponseWrapper(
                false,
                500,
                "Error: GET failed!",
                null,
                null,
                error.message
            ));
        }else{
            reply.send(new ResponseWrapper(
                true,
                200,
                "Operation went well",
                null,
                items,
                null
            ));
        }
    });
});

app.post('/api/recipes', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("recipe");

    let newRecipe = request.body as Recipe;

    collection.insertOne(newRecipe, (error, item) =>{
        if(error){
            reply.send(new ResponseWrapper(
                false,
                500,
                "Error: POST failed!",
                null,
                null,
                error.message
            ));
        }else{
            reply.send(new ResponseWrapper(
                true,
                200,
                "Operation went well",
                item,
                null,
                null
            ));
        }
    });
});

app.put<{ Params: IdParams }>('/api/recipes/:id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("recipe");

    let RecpeToModify = request.body as Recipe;
    RecpeToModify._id = new ObjectId(RecpeToModify._id) as any;
    collection.updateOne({ _id: new ObjectId(request.params.id) }, { $set: RecpeToModify }, (error, item) =>{
        if(error){
            reply.send(new ResponseWrapper(
                false,
                500,
                "Error: PUT failed!",
                null,
                null,
                error.message
            ));
        }else{
            reply.send(new ResponseWrapper(
                true,
                200,
                "Operation went well",
                item,
                null,
                null
            ));
        }
    });
});

app.delete<{ Params: IdParams }>('/api/recipes/:id', (request, reply) =>{
    const db = app.mongo.db;
    const collection = db.collection("recipe");

    collection.deleteOne({ _id: new ObjectId(request.params.id) }, (error, item) =>{
        if(error){
            reply.send(new ResponseWrapper(
                false,
                500,
                "Error: DELETE failed!",
                null,
                null,
                error.message
            ));
        }else{
            reply.send(new ResponseWrapper(
                true,
                200,
                "Operation went well",
                item,
                null,
                null
            ));
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