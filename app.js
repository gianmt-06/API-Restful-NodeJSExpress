var express = require('express');
var mysql = require('mysql');

var app = express();
app.use(express.json());

//Conection parameters
var connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: 'password',
    database: 'articlesDB',
    port:'3306',
});

//test conection
connection.connect(function(error){
    if(error){
        throw error;
    } else {
        console.log("Successful connection");
    }
});

app.get('/', function(req, res){
    res.send('init root');
});

//Obtener todos los articulos
app.get('/api/articles', (req, res) => {
    connection.query('SELECT * FROM articles', (error, rows) => {
        if(error){
            throw error;
        } else {
            res.send(rows);
        }
    });
});

//Obtener un artículo por id
app.get('/api/articles/:id', (req, res) => {
    connection.query('SELECT * FROM articles WHERE id = ?', [req.params.id], (error, row) => {
        if(error){
            throw error; 
        } else {
            res.send(row); //Obtener una fila especifica de la tabla
            //res.send(row[0].description) //Obtener un atributo específico de la tabla
        }
    });
});

//Insertar en la base de datos
app.post('/api/articles', (req, res) => {
    let data = { description:req.body.description, price:req.body.price, stock:req.body.stock };
    let sql = "INSERT INTO articles SET ?";

    connection.query(sql, data, function(error, result){
        if(error){
            throw error; 
        } else {
            res.send(result); 
        }
    });
});

//Editar artículo
app.put('/api/articles/:id', (req, res) => {
    let id = req.params.id;
    let description = req.body.description;
    let price = req.body.price;
    let stock = req.body.stock;
    let sql = 'UPDATE articles SET description = ?, price = ?, stock = ? WHERE id = ?';

    connection.query(sql, [description, price, stock, id], function(error, result){
        if(error){
            throw error; 
        } else {
            res.send(result); 
        }
    });
});

//Eliminar artículo
app.delete('/api/articles/:id', (req, res) => {
    connection.query('DELETE FROM articles WHERE id = ?', [req.params.id], function(error, rows){
        if(error){
            throw error; 
        } else {
            res.send(rows); 
        }
    });
});

const puerto = process.env.PUERTO || 3000;

app.listen(puerto, function(){
    console.log("Run Server " + "Port: " + puerto);
});
