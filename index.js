const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://user:password@localhost:17207/nodejs-backend';

let db;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    db.collection('user-data').findOne({_id: 'example-user'}, (err, result) => {
        if (err) return console.log(err);

        res.send(result);
        console.log('Data retrieved');
    });
});

app.post('/', (req, res) => {
    console.log('Post: ' + req.body);
    let obj = req.body;
    let idToken = req.query.idToken;

    // validate token against google oauth provider
    // if token is valid set the email that is returned by google as _id

    obj._id = 'example-user';

    db.collection('user-data').updateOne(obj, (err, result) => {
        if (err) return console.log(err);

        console.log('saved to database');
        res.json({result: req.body});
    });
});

MongoClient.connect(mongoUrl, (err, database) => {
    if (err) return console.log('Are you sure you have a mongodb server running?\n' + err);
    db = database;
    app.listen(3000, function () {
        console.log('listening on 3000');
    });
});

