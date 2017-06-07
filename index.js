const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://user:password@localhost:27017/nodejs-backend';
let db;

let GoogleAuth = require('google-auth-library');
let auth = new GoogleAuth;
var clientSecrets = require('./client-secrets.json');
let client = new auth.OAuth2(
    clientSecrets.web.client_id,
    clientSecrets.web.client_secret,
    clientSecrets.web.redirect_uris[0]
);

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());

app.get('/', (request, response) => {
    let idToken = request.query.idToken;
    client.verifyIdToken(
        idToken,
        clientSecrets.web.client_id,
        function (err, login) {
            if (err) throw err;

            const payload = login.getPayload();

            if (payload.email_verified) {
                db.collection('user-data').findOne({email: payload.email}, (err, result) => {
                    if (err) return console.log(err);

                    response.json(result);
                    console.log('Data retrieved');
                });
            }
        });
});

app.post('/', (request, response) => {
    console.log('Post: ' + JSON.stringify(request.body));
    let obj = request.body;
    let idToken = request.query.idToken;
    client.verifyIdToken(
        idToken,
        clientSecrets.web.client_id,
        function (err, login) {
            if (err) throw err;

            const payload = login.getPayload();

            if (payload.email_verified) {
                obj.email = payload.email;
                db.collection('user-data').updateOne({email: payload.email}, obj, {upsert: true}, (err, result) => {
                    if (err) return console.log(err);

                    console.log('saved to database');
                    response.json({result: request.body});
                });
            }
        });

});

MongoClient.connect(mongoUrl, (err, database) => {
    if (err) return console.log('Are you sure you have a mongodb server running?\n' + err);
    db = database;
    app.listen(3000, function () {
        console.log('listening on 3000');
    });
});
