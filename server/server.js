var http = require('http');
var addNode = require('./adding-node');

var server = http.createServer(function (req, res) {
    addNode('Либідська', 50.414431, 30.52488, ["Палац \"Україна\""]);
    res.end("Вузол додано");
});
server.listen(3000);