const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const router = require('./common/server.router');

global.appRoot = path.resolve(__dirname);
dotenv.config({ path: appRoot + '/../.env' })
global.db = require('./common/db/knex.config');
global.HttpStatus = require('http-status-codes');

app.set('port', process.env.PORT || 4000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/pratilipi/', router);


let connections = [];
const server = app.listen(app.get('port'), function(err) {
    if (err) {
        console.warn(err);
        process.exit(1);
    } else {

        server.on('connection', connection => {
            connections.push(connection);
            connection.on('close', () => connections = connections.filter(curr => curr !== connection));
        });

        process.send = process.send || function() {};
        process.send('ready');
        console.info(`[Pratilipi-asm : ${process.pid}] Express server listening on port ${app.get('port')}`);
    }
});


process.on('SIGINT', () => {
    console.info(`[Pratilipi-asm : ${process.pid}] Received SIGINT`);
    console.info(`[Pratilipi-asm : ${process.pid}] Shutting down server gracefully on port ${app.get('port')}`);

    server.close(() => {
        console.info(`[Pratilipi-asm : ${process.pid}] Server closed for incoming connections`);
        setTimeout(() => {
            console.info(`[Pratilipi-asm : ${process.pid}] Current connections being processed = ${connections.length}`);
            if (connections.length === 0) {
                console.info(`[Pratilipi-asm : ${process.pid}] Exiting process`);
                process.exit(0);
            }
        }, 1500);
    });
});