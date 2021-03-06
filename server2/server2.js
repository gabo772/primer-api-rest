const express = require("express");

const sql_server = require("mssql");
const app = express();

let auth = require('./auth/authentication')

var usuarios = [];

//**********Conexion a base de datos

var conexion = {
  user: process.env.USER_SERVER || "gabriel",
  password: process.env.PASS_SERVER || "Demon666",
  server: process.env.DATABASE_HOST || "baltazar01.database.windows.net",
  database: "test1",
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//cors
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://rosario-app.herokuapp.com"
  );

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,content-type,Accept,Authorization"
  );
  res.setHeader('Access-Control-Allow-Credentials', "true");

  // response to preflight request 
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.send(200);

  }
  else {
    //move on
    next();
  }

});

let respuesta = {
  error: false,
  codigo: 200,
  mensaje: "",
};

app.get("/", auth(), function (req, res) {
  respuesta = {
    error: true,
    codigo: 200,
    mensaje: "Punto de inicio",
  };
  res.send(respuesta);
});




app.get("/usuarios", auth(), (req, res) => {
  let sql =
    "SELECT [user].[id] AS ID,[username],[password],[description],[photo]  FROM [test1].[user] INNER JOIN [test1].[type] ON [test1].[user].[id_type]=[test1].[type].[id]";
  respuesta = {
    error: false,
    codigo: 200,
    mensaje: "",
  };
  sql_server
    .connect(conexion)
    .then((pool) => {
      return pool.request().query(sql);
    })
    .then((result) => {
      if (result.recordset.length == 0) {
        respuesta = {
          error: true,
          codigo: 501,
          mensaje: "No existen usuarios",
        };
      } else {
        for (var i = 0; i < result.recordset.length; i++) {
          usuarios.push({
            id: result.recordset[i].ID,
            nombre: result.recordset[i].username,
            password: result.recordset[i].password,
            tipo_de_usuario: result.recordset[i].description,
            foto: result.recordset[i].photo,
          });
        }
        respuesta = {
          error: false,
          codigo: 200,
          mensaje: "Se han listado los usuarios exitosamente",
          respuesta: usuarios,
        };
        usuarios = [];
      }
      res.status(200).send(respuesta);
    });
});
/* app.get('/usuarios/:id', function (req, res) {
    const { id } = req.params
    respuesta = {
        error: false,
        codigo: 200,
        mensaje: ''
    };

    conexionMysql.query(`SELECT * FROM USER WHERE ID = ${id}`, (error, result) => {
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

                conexionMysql.query('INSERT INTO USER SET ?', user, error => {
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

                conexionMysql.query(`UPDATE USER SET username = '${nombre}', password = '${password}', id_type='${tipo}',photo=${foto} WHERE id=${id}`, (error) => {
                    if (error) {
                        throw error;
                    }

                    conexionMysql.query(`SELECT * FROM USER WHERE id=${id}`, (error, result) => {
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
    conexionMysql.query(`DELETE FROM user WHERE id=${id}`, error => {
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
    conexionMysql.query(`DELETE FROM user`, error => {
        if (error) throw error
        respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Registros eliminados'
        };

        res.send(respuesta);
    })

}); */
app.use(function (req, res, next) {
  respuesta = {
    error: true,
    codigo: 404,
    mensaje: "URL no encontrada",
  };
  res.status(404).send(respuesta);
});

let port = process.env.PORT || "8090";
app.listen(port, () => {
  console.log(`servidor corriendo en puerto ${port}`);
});
