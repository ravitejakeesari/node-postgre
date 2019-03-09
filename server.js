var express = require('express');
var pg = require('pg');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var config = {
    user: 'postgres',
    database: 'postgres',
    password: '123456789',
    port: 5432,
    max: 10, // max number of connection can be open to database
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being close;
}

var pool = new pg.Pool(config);

/**
 * Rest Api's for Employee
 */

//get employee list
app.get('/api/getemployees', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            res.status(400).send(err);
        }
        client.query('select * from employees', (err, result) => {
            if (err) res.status(400).send(err);
            res.status(200).send(result.rows);
        })

    })
})


//create an employee
app.post('/api/createemployee', (req, res) => {
    console.log('req.body is ', req.body)
    let result = []
    pool.connect((err, client,done) => {
        if (err) {
            res.status(400).send(err);
        }
        client.query('insert into employees(name,email_address,phon_number,salary,dept_id) values($1,$2,$3,$4,$5)',[req.body.name,req.body.email,req.body.phoneNumber,req.body.salary,req.body.dept_id]);
        const query = client.query('select * from employees');
        query.on('row',(row)=>{
            result.push(row);
        })
        query.on('end',()=>{
            done();
            res.status(200).send(result);
        })
    })
})

//delete an employee based on id
app.post('/api/deleteemployee', (req, res) => {
    console.log('req.body is ', req.body)
    let id = Number(req.body.id);
    let result = []
    pool.connect((err, client,done) => {
        if (err) {
            res.status(400).send(err);
        }
        client.query('delete from employees where id = ($1)',[id]);
        const query = client.query('select * from employees');
        query.on('row',(row)=>{
            result.push(row);
        })
        query.on('end',()=>{
            done();
            res.status(200).send(result);
        })
    })
})

//update an employee based on id
app.post('/api/updateemployee', (req, res) => {
    console.log('req.body is ', req.body)
    let id = Number(req.body.id);
    let result = []
    pool.connect((err, client,done) => {
        if (err) {
            res.status(400).send(err);
        }
        client.query(
            'update employees set name = ($1),email_address = ($2),phon_number = ($3),salary = ($4),dept_id = ($5) where id = ($6)',
            [req.body.name,req.body.email,req.body.phoneNumber,req.body.salary,req.body.dept_id,req.body.id]
        );
        const query = client.query('select * from employees');
        query.on('row',(row)=>{
            result.push(row);
        })
        query.on('end',()=>{
            done();
            res.status(200).send(result);
        })
    })
})


//get department list using stored procedures
app.get('/api/getdepartments', (req, res) => {
    pool.connect((err, client, done) => {
        if (err) {
            res.status(400).send(err);
        }
        client.query('select * from getAllDepartments()', (err, result) => {
            if (err) res.status(400).send(err);
            res.status(200).send(result.rows);
        })

    })
})


//listening to server
app.listen(4000, () => {
    console.log("server is running on port 4000");
})