
class Conexion {
    constructor(mysql) {
        this.conexion = mysql.createConnection({
            host: 'localhost',
            database: 'test1',
            user: 'root',
            password: '2020',
        })
    }


    Conectar = () => {
        this.conexion.connect((error) => {
            if (error) {
                console.log('Error de conexión: ' + error.stack);
                return;
            }

            console.log('Conectado con el identificador ' + conexion.threadId)
        })
    }

    Desconectar = () => {
        this.conexion.end();
    }
}



