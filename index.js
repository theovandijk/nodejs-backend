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

app.get('/', (request, response, next) => {
    let idToken = request.query.idToken;
    client.verifyIdToken(
        idToken,
        clientSecrets.web.client_id,
        function (err, login) {
            if (err) return next(err);

            const payload = login.getPayload();

            if (payload.email_verified) {
                db.collection('user-data').findOne({email: payload.email}, (err, result) => {
                    if (err) return console.log(err);

                    response.json(result);
                    console.log('Data retrieved for user: ' + payload.email);
                });
            } else {
                throw new Error('Unauthorized');
            }
        });
});

app.post('/', (request, response, next) => {
    console.log('Post: ' + JSON.stringify(request.body));
    let obj = request.body;
    let idToken = request.query.idToken;
    client.verifyIdToken(
        idToken,
        clientSecrets.web.client_id,
        function (err, login) {
            if (err) return next(err);

            const payload = login.getPayload();

            if (payload.email_verified) {
                obj.email = payload.email;
                db.collection('user-data').updateOne({email: payload.email}, obj, {upsert: true}, (err, result) => {
                    if (err) return next(err);

                    console.log('saved to database');
                    response.json({result: request.body});
                });
            } else {
                throw new Error('Unauthorized');
            }
        });

});

app.use(function (err, request, response, next) {
    console.error(err.stack);
    response.status(401);
    return response.json(err.message);
});

MongoClient.connect(mongoUrl, (err, database) => {
    if (err) return console.log('Are you sure you have a mongodb server running?\n' + err);
    db = database;
    app.listen(3000, function () {
        console.log('listening on 3000');
    });
});
