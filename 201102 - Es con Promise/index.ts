import fastify from 'fastify'
import * as mysql from 'mysql'
import { User } from './models/user'
import { ResponseWrapper } from './models/ResponseWrapper'

const app = fastify({
    logger: true,
    ignoreTrailingSlash: true
});

var connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'php1234',
    database: 'Test201019'
});

var respons = new ResponseWrapper<User[]>();

function getAllUsers() {
    return new Promise<ResponseWrapper<User[]>>((resolve, reject) => {
        connection.query("SELECT * FROM user", (error, results, fields) => {
            if (error) {
                respons.result = false;
                respons.errors = error.message;
                respons.status = 401;
                reject(respons);
                return;
            }

            respons.result = true;
            respons.data = results;
            respons.status = 200;
            resolve(respons);
        });
    });
}

function insertUser(user: User){
    return new Promise<ResponseWrapper<User[]>>((resolve, reject) =>{
        connection.query("INSERT INTO user VALUES(?,?,?,?)",
        [user.id, user.firstname, user.lastname, user.age],
        (error, results, fields) =>{
            if(error){
                respons.result = false;
                respons.errors = error.message;
                respons.status = 401;

                reject(respons);
                return;
            }

            respons.result = true;
            respons.data = results;
            respons.status = 200;
            resolve(respons);
        });
    });
}

function modifyUser(user: User){
    return new Promise<ResponseWrapper<User[]>>((resolve, reject) =>{
        connection.query("UPDATE user SET firstname = ?, lastname = ?, age = ? WHERE id = ?",
        [user.firstname, user.lastname, user.age, user.id],
        (error, results, fields) =>{
            if(error){
                respons.result = false;
                respons.errors = error.message;
                respons.status = 401;

                reject(respons);
                return;
            }

            respons.result = true;
            respons.data = results;
            respons.status = 200;
            resolve(respons);
        });
    });
}

function deleteUser(id: number){
    return new Promise<ResponseWrapper<User[]>>((resolve, reject) =>{
        connection.query("DELETE FROM user WHERE id = ?",
        [id],
        (error, results, fields) =>{
            if(error){
                respons.result = false;
                respons.errors = error.message;
                respons.status = 401;

                reject(respons);
                return;
            }

            respons.result = true;
            respons.data = results;
            respons.status = 200;
            resolve(respons);
        });
    });
}

app.get('/', (request, reply) => {
    getAllUsers().then((queryData) => {
        reply.status(queryData.status).send({
            result: queryData.status,
            message: queryData.data
        })
    }, (error: ResponseWrapper<User[]>) => {
            reply.status(error.status).send({
                result: error.status,
                error: error.errors
            });
        });
    });

app.post('/api/user', (request, reply) =>{
    let user = request.body as User;

    insertUser(user).then((queryData) =>{
        reply.status(queryData.status).send({
            result: queryData.status,
            message: queryData.data
        });
    }, (error: ResponseWrapper<User[]>) =>{
        reply.status(error.status).send({
            result: error.status,
            error: error.errors
        });
    });
});

app.put<{ Params: ParametersType }>('/api/user/:id', (request, reply) =>{
    let user = request.params.id;
});

app.delete('/api/user/:id', (request, reply) =>{

});

app.listen(3000, (error, address) =>{
    if(error){
        app.log.error(error);
        process.exit(1);
    }else{
        app.log.info(`server listening on ${address}`);
    }
});
