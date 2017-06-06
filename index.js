const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Data retrieved');
    console.log('Data retrieved');
});

app.post('/', (req, res) => {
    res.json({result: req.body});
    console.log('Post: ' + req.body);
});

app.listen(3000, function () {
    console.log('listening on 3000');
});