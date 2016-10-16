var fs = require('fs');

module.exports = function (name, lat, lng, relatedNodes) {
    fs.readFile('../nodes.json', 'utf8', function (err, data) {
        if (err) console.log(err);
        var nodes = JSON.parse(data);

        if (findNode(name, nodes)) return;
        var newNode = {
            name: name,
            coords: {
                lat: lat,
                lng: lng
            },
            relatedNodes: relatedNodes
        };

        for (var i = 0; i < newNode.relatedNodes.length; i++) {
            findNode(newNode.relatedNodes[i], nodes).relatedNodes.push(newNode.name);
        }
        nodes.push(newNode);
        fs.writeFile('../nodes.json', JSON.stringify(nodes), function (err) {
            if (err) console.log(err);
        })
    });
};

function findNode(name, nodes) {
    for (var i = 0; i < nodes.length; i++) {
        if (name == nodes[i].name) {
            return nodes[i];
        }
    }
    return null;
}



