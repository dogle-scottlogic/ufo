var express = require('express');
var app = express();
var path = require('path');

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/index.html'));
});

app.use('/lib', express.static(__dirname + '/node_modules/'));
app.use('/scripts', express.static(__dirname + '/build/'));
app.use('/styles', express.static(__dirname + '/app/styles/'));

app.listen(3000, console.log('running on port:3000...'));