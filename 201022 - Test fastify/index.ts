import fastify from 'fastify'
import * as mysql from 'mysql'

const app = fastify({
    logger: true,
    ignoreTrailingSlash: true
});

var connection = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: 'php1234',
    database: 'Test201019'
});

app.get('/', (request, reply) =>{
    connection.query("SELECT * FROM user", (error, results, fields) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error
            });
        }else{
            reply.status(200).send({ 
                result: true,
                results
            });
        }
    });
});

interface ParametersType{
    id: string
}

app.get<{Params: ParametersType}>("/api/users/:id", (request, reply) =>{
    let userId = request.params.id;

    connection.query("SELECT * FROM user WHERE id = ?", [userId], (error, results, fields) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: Get fallita!",
                error: error
            });
        }else{
            reply.status(200).send({ 
                result: true,
                results
            });
        }
    });
});

app.post("/api/users", (request, reply) => {
    let users = request.body as Users;

    connection.query("INSERT INTO user VALUES(?,?,?,?)",
    [users.id, users.firstname],
    (error, results, fields) =>{
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
});

app.put<{Params: ParametersType}>("/api/users/:id", (request, reply) =>{
    let userId = request.params.id;
    let users = request.body as Users;

    connection.query("UPDATE user SET firstname = ?, lastname = ?, age = ? WHERE id = ?",
    [users.firstname, users.lastname, users.age, userId],
    (error, results, fields) =>{
        if(error){
            reply.status(404).send({
                result: false,
                message: "Error: Put fallita!",
                error: error
            });
        }else{
            reply.status(200).send({ 
                result: true,
                message: "Modificato!",
                results
            });
        }
    });
})

app.delete<{Params: ParametersType}>("/api/users/:id", (request, reply) =>{
    let userId = request.params.id;
    
    connection.query("DELETE FROM user WHERE id = ?",
        [userId],
        (error, results, fields) => {
            if(error){
                reply.status(404).send({
                    result: false,
                    message: "Error: Delete fallita!",
                    error: error
                });
            }else{
                reply.status(200).send({ 
                    result: true,
                    message: "Cancellato!",
                    results
                });
            }
        });
})

app.listen(3000, (error, address) =>{
    if(error){
        app.log.error(error);
        process.exit(1);
    }else{
        app.log.info(`server listening on ${address}`);
    }
})

class Users{
    constructor(
        public id: number, 
        public firstname: string, 
        public lastname: string,
        public age: number){}
}