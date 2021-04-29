import fastify from 'fastify'
import * as mysql from 'mysql'
import * as jwt from 'fastify-jwt';
import * as bcrypt from 'bcrypt';
import { LoginRequest } from './models/LoginRequest';

const saltRound = 10;

const app = fastify({
    logger: true,
    ignoreTrailingSlash: true
});

var connection = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: 'php1234',
    database: 'autentichationjwt'
});

app.register(jwt, {
    secret: 'supersecret'
});

// Fase di registrazione e creazione dell'hash
app.post('/api/singup', (request, reply) =>{
    let loginRequest= request.body as LoginRequest;

    bcrypt.hash(request.body, saltRound).then(value =>{
        loginRequest.password = value;
        connection.query("INSERT INTO users VALUES(?,?,?,?,?,?)"
        [
            loginRequest.id, 
            loginRequest.username, 
            loginRequest.password, 
            loginRequest.email,
            loginRequest.name,
            loginRequest.surname
        ], (error, results, fields) =>{
            if(error){
                reply.status(404).send({
                    result: false,
                    message: "Error: Post fallita!",
                    error: error
                });
            }else{
                reply.status(200).send({ 
                    result: true,
                    results
                });
            }
        });
    }).catch(reason =>{
        reply.status(500).send({ 
            result: false, 
            errorText: "Errore nel calcolo dell'hash della password",
            reason: reason
        });
    });

    // const token = app.jwt.sign({ loginRequest });
    // reply.send({
    //     result: true,
    //     token
    // });
});

// Creazione del Token
app.post("/api/token", (request, reply) =>{
    
});

// Verifica del Token
app.addHook("onRequest", async (request, reply) =>{
    try{
        await request.jwtVerify();
    }
    catch(error){
        reply.send({
            result: false,
            error
        });
    }
});

// hash della password;
bcrypt.hash(myPlaintextPassword, saltRound, (error, hash) =>{

});

// Verifica della password
bcrypt.compare(myPlaintextPassword, hash, (error, hash) =>{

});

app.listen(3000, (error, address) =>{
    if(error){
        app.log.error(error);
        process.exit(1);
    }else{
        app.log.info(`server listening on ${address}`);
    }
})