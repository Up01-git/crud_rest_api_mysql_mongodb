const express = require("express");
const mysql = require('mysql2');
const dbConnect = require("./db");
const bodyparser = require('body-parser');

const app = express();

app.use(express.json());
app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    port: 3360,
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'tododb',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.get('/todolist', async (req, res) => {
    let data = await dbConnect();
    data = await data.find().toArray();
    res.send(data);
});

app.post("/todolist", async (req, res) => {
    // console.log(req.body);
    let data = await dbConnect();
    let result = data.insertOne(req.body);
    res.send(result);
});

app.put("/todolist/:no", async (req, res) => {
    // console.log(req.body);
    let data = await dbConnect();
    let result = data.updateOne({
        no: req.params.no},
        {$set: req.body}
        );
    res.send(result);
});

app.delete("/todolist/:no", async (req,res) => {
    let data = await dbConnect();
    const result = data.deleteOne({no: req.params.no});
    res.send(result);
});

app.listen(3000, () => console.log('Express server is running at port no : 3000'));


app.get('/todolist', (req, res) => {
    mysqlConnection.query('SELECT * FROM list1', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    });
});


app.get('/todolist/:no', (req, res) => {
    mysqlConnection.query('SELECT * FROM list1 WHERE no = ?', [req.params.no], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    });
});


app.delete('/todolist/:no', (req, res) => {
    mysqlConnection.query('DELETE FROM list1 WHERE no = ?', [req.params.no], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    });
});


app.post('/todolist', (req, res) => {
    let ele = req.body;
    var sql = "SET @no = ?;SET @item = ?;";
    mysqlConnection.query(sql, [ele.no, ele.item], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted list item : '+element[0].no);
            });
        else
            console.log(err);
    });
});


app.put('/todolist', (req, res) => {
    let ele = req.body;
    var sql = "SET @no = ?;SET @item = ?;";
    mysqlConnection.query(sql, [ele.no, ele.item], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    });
});