const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const https = require("https");
const config = require('./config/config');

// Database Name
const url = 'mongodb://localhost:27017';
const dbName = config.dbName;

app.get('/init', function (req, res) {
    const cinemaData = require('./databaseinit.js');
    res.send('Created database!');
});

app.get('/', function (req, res) {
    res.send('Database API: \n \\movies - get all the movies \n \\getMovie\\:name - returns the movie that has that name \n \\debuts - get all the debuts movies  \n \\cinemas - get the list of all cinemas \n \\localizations - get the geographic points of all cinemas');
});

app.get('/movies', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) { return console.dir(err); }
        const db = client.db(dbName);
        db.collection('movies').find({}).project({ 'name': 1, 'imageurl': 1, 'genre': 1, 'duration': 1, 'minAge': 1, '_id': 0 }).toArray(function (err, docs) {
            if (err)
                throw err;
            res.send(docs)
        });
    });
});

app.get('/getMovie/:name', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) { return console.dir(err); }
        const db = client.db(dbName);
        db.collection('movies').createIndex({ name: "text" })
        db.collection('movies').find({ $text: { $search: "\"\"" + req.params.name + "\"\"" } }).project({ '_id': 0 }).toArray(function (err, docs) {
            if (err)
                throw err;
            res.send(docs)
        });
    });
});




app.get('/debuts', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) { return console.dir(err); }
        const db = client.db(dbName);
        db.collection('debuts').find({}).project({ 'name': 1, 'imageurl': 1, 'genre': 1, 'duration': 1, 'minAge': 1, '_id': 0 }).toArray(function (err, docs) {
            if (err)
                throw err;
            res.send(docs)
        });
    });
});



app.get('/cinemas', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) { return console.dir(err); }
        const db = client.db(dbName);
        db.collection('cinemas').find({}).project({ '_id': 0 }).toArray(function (err, docs) {
            if (err)
                throw err;
            res.send(docs)
        });
    });
});

app.get('/localizations', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        if (err) { return console.dir(err); }
        const db = client.db(dbName);
        db.collection('cinemas').find({}).project({ '_id': false, movies: false, address: false, telephone: false }).toArray(function (err, docs) {
            if (err)
                throw err;
            res.send(docs)
        });
    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});
