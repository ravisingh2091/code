const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const routes = require('./routes');
const config = require('./lib/config');
const db = require('./database');
const https = require('https');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000 }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(cors({
    origin: '*',
    // origin: config.webBaseUrl,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.static(__dirname + '/images'));
app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
});


const httpsOptions = {
    key: fs.readFileSync('./lib/yourdomain.key'),
    cert: fs.readFileSync('./lib/b5565227f4fb5ea.crt')
};
https.createServer(httpsOptions, app).listen(config.apiPort, () => {
    // console.log('server running at ' + config.apiPort);
    db.connect((err) => {
        if (err) {
            console.log(err);
        }
        app.db = db;
        routes(app);
    });
});
