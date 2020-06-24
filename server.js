const express = require('express')
const mysql = require('mysql')
const app = express()


var usuarios = []



//**********Conexion a base de datos 

let conexion = mysql.createConnection({
    host: 'localhost',
    database: 'test1',
    user: 'root',
    password: '2020',
})


Conectar = () => {
    conexion.connect((error) => {
        if (error) {
            console.log('Error de conexión: ' + error.stack);
            return;
        }

        console.log('Conectado con el identificador ' + conexion.threadId)
    })
}

Desconectar = () => {
    conexion.end();
}






const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();

})


let respuesta = {
    error: false,
    codigo: 200,
    mensaje: ''
};

app.get('/', function (req, res) {
    respuesta = {
        error: true,
        codigo: 200,
        mensaje: 'Punto de inicio'
    };
    res.send(respuesta);
});
app.get('/usuarios', function (req, res) {
    let sql = "SELECT user.id AS ID,username,password,description,photo  FROM user INNER JOIN type ON user.id_type=type.id"
    respuesta = {
        error: false,
        codigo: 200,
        mensaje: ''
    };

    conexion.query(sql, (error, results, fields) => {

        if (results.length == 0) {
            respuesta = {
                error: true,
                codigo: 501,
                mensaje: 'No existen usuarios'
            };
        } else {
            for (var i = 0; i < results.length; i++) {

                usuarios.push({
                    id: results[i].ID,
                    nombre: results[i].username,
                    password: results[i].password,
                    tipo_de_usuario: results[i].description,
                    foto: results[i].photo
                })
            }
            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Se han listado los usuarios exitosamente',
                respuesta: usuarios
            };
            usuarios = []

        }
        res.send(respuesta);

    })

});
app.get('/usuarios/:id', function (req, res) {
    const { id } = req.params
    respuesta = {
        error: false,
        codigo: 200,
        mensaje: ''
    };

    conexion.query(`SELECT * FROM USER WHERE ID = ${id}`, (error, result) => {
        if (error) throw error;
        if (result.length == 0) {
            respuesta = {
                error: true,
                codigo: 501,
                mensaje: 'No existe el usuario solicitado'
            };
        } else {
            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Se ha listado el usuario correctamente',
                respuesta: result[0]
            };
        }
        res.send(respuesta);
    })

});
app.post('/usuario', function (req, res) {

    if (!req.body.nombre) {

        respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'El campo nombre es requerido'
        };
    } else {
        if (!req.body.password) {
            respuesta = {
                error: true,
                codigo: 502,
                mensaje: 'El campo passsword es requerido'
            };
        }
        else {
            if (!req.body.tipo) {
                respuesta = {
                    error: true,
                    codigo: 502,
                    mensaje: 'El campo tipo es requerido'
                };
            }
            else {
                let user = {
                    username: req.body.nombre,
                    password: req.body.password,
                    id_type: req.body.tipo,
                    photo: req.body.foto
                }

                conexion.query('INSERT INTO USER SET ?', user, error => {
                    if (error) {
                        respuesta = {
                            error: true,
                            codigo: 503,
                            mensaje: 'El usuario ya fue creado previamente'
                        };
                        throw error
                    }
                    respuesta = {
                        error: false,
                        codigo: 200,
                        mensaje: 'Usuario creado',
                        respuesta: user
                    };

                    res.send(respuesta);
                })

            }
        }
    }

});
app.put('/usuario/update/:id', function (req, res) {

    const { id } = req.params
    const { nombre, password, tipo, foto } = req.body

    if (!nombre) {
        respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'El campo nombre es requerido'
        };
    } else {
        if (!password) {

            respuesta = {
                error: true,
                codigo: 502,
                mensaje: 'El campo contraseña es requerido'
            };

        }
        else {
            if (!tipo) {

                respuesta = {
                    error: true,
                    codigo: 502,
                    mensaje: 'El campo tipo de usuario es requerido'
                };

            }
            else {

                conexion.query(`UPDATE USER SET username = '${nombre}', password = '${password}', id_type='${tipo}',photo=${foto} WHERE id=${id}`, (error) => {
                    if (error) {
                        throw error;
                    }

                    conexion.query(`SELECT * FROM USER WHERE id=${id}`, (error, result) => {
                        if (error) throw error;

                        respuesta = {
                            error: false,
                            codigo: 200,
                            mensaje: 'Usuario actualizado',
                            respuesta: result
                        };

                        res.send(respuesta);

                    })


                })
            }
        }

    }


});
app.delete('/usuario/delete/:id', function (req, res) {
    const { id } = req.params
    conexion.query(`DELETE FROM user WHERE id=${id}`, error => {
        if (error) throw error
        respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Usuario eliminado'
        };

        res.send(respuesta);
    })

});
app.delete('/usuario/delete/', function (req, res) {
    const { id } = req.params
    conexion.query(`DELETE FROM user`, error => {
        if (error) throw error
        respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Registros eliminados'
        };

        res.send(respuesta);
    })

});
app.use(function (req, res, next) {
    respuesta = {
        error: true,
        codigo: 404,
        mensaje: 'URL no encontrada'
    };
    res.status(404).send(respuesta);
});


app.listen(8090, () => {
    Conectar()
    console.log("El servidor está inicializado en el puerto 8090");

});