const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const routes = require('./routes');
const config = require('./lib/config');
const db = require('./database');

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));
app.use(bodyParser.json({ limit: '50mb' }));

// app.use(cors({
//    origin: config.webBaseUrl,
//    methods: ['GET', 'PUT', 'POST', 'DELETE'],
//    allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.static(__dirname + '/images'));
app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
});


db.connect((err) => {
    if (err) {
        console.log(err);
    }
    app.db = db;
    routes(app);
    app.listen(config.apiPort);
});

// app.use(function (req, res, next) {
//     res.header('Allow-Control-Allow-Origin', '*');
//     res.header('Allow-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
//     res.header('Allow-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
