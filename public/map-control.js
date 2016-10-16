var nodes = getNodes();
var clickedA = false, clickedB = false;

$(document).ready(function () {
    for (var i = 0; i < nodes.length; i++) {
        $(document.createElement('option')).text(nodes[i].name).appendTo('#nodeA, #nodeB');
    }
});

function getNodes() {
    var xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open('GET', '../nodes.json', false);
    xmlHttpReq.send();
    if (xmlHttpReq.status == 200) {
        return JSON.parse(xmlHttpReq.responseText);
    }
    else {
        alert('Помилка!');
        return;
    }
}

function findNode(name) {
    for (var i = 0; i < nodes.length; i++) {
        if (name == nodes[i].name) {
            return nodes[i];
        }
    }
}

function getNearestNode(coords) {
    var nodeLen = getLength(coords, nodes[0].coords);
    var index = 0;
    for (var i = 1; i < nodes.length; i++) {
        var tempLen = getLength(coords, nodes[i].coords);
        if (tempLen < nodeLen) {
            nodeLen = tempLen;
            index = i;
        }
    }
    return nodes[index]
}

function createMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(50.4437859, 30.4838895),
        zoom: 12
    });
    var markerA = new google.maps.Marker();
    var markerB = new google.maps.Marker();
    var helpA = new google.maps.InfoWindow({
        content: 'Початок маршруту'
    });

    var helpB = new google.maps.InfoWindow({
        content: 'Кінець маршруту'
    });

    var paintedPath = new google.maps.Polyline({
        strokeColor: 'red',
        strokeOpacity: 0.8,
        strokeWeight: 2
    });

    google.maps.event.addListener(map, 'click', function (event) {
        if (clickedA && clickedB) return;

        var clickCoords = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };

        if (clickCoords.lat > 50.535931 || clickCoords.lng < 30.321156 || clickCoords.lat < 50.339790 || clickCoords.lng > 30.815417) {
            $('.alert').text('Вибір станцій можливий лише в межах міста Київ!').show();
            return;
        }

        var node = getNearestNode(clickCoords);
        var tempElem;

        if (!clickedA) {
            tempElem = $('#nodeA');
        }
        else {
            tempElem = $('#nodeB');
        }
        $(tempElem).val(node.name).trigger('change');
    });

    google.maps.event.addListener(markerA, 'click', function () {
        markerA.setMap(null);
        $('#nodeA').val('Не вибрано').trigger('change');
    });

    google.maps.event.addListener(markerB, 'click', function () {
        markerB.setMap(null);
        $('#nodeB').val('Не вибрано').trigger('change');
    });

    $('#nodeA, #nodeB').change(function () {
        $('.alert').hide();
        var marker, helpBlock;
        var selectId = $(this).attr('id');

        if (selectId == 'nodeA') {
            clickedA = true;
            marker = markerA;
            helpBlock = helpA
        }
        else {
            clickedB = true;
            marker = markerB;
            helpBlock = helpB
        }

        var nodeName = $(this).val();
        if (nodeName == 'Не вибрано') {
            if (selectId == 'nodeA') clickedA = false;
            else clickedB = false;
            marker.setMap(null);
            return;
        }
        var coords = findNode(nodeName).coords;
        marker.setPosition(new google.maps.LatLng(coords.lat, coords.lng));
        marker.setMap(map);
        helpBlock.open(map, marker);
    });

    $('.btn').click(function () {
        paintedPath.setMap(null);

        var nodeAValue = $('#nodeA').val();
        var nodeBValue = $('#nodeB').val();
        if (nodeAValue == nodeBValue) {
            $('.alert').text('Початок і кінець маршруту не можуть бути однією станцією!').show();
        }
        else if (nodeAValue == 'Не вибрано' || nodeBValue == 'Не вибрано') {
            $('.alert').text('Ви не вибрали одну з точок!').show();
        }
        else {
            var routeObj = findRoute(createDistanceMatrix(nodes), findNode($('#nodeA').val()), findNode($('#nodeB').val()));
            var coordsOfPath = [];
            for (var i = 0; i < routeObj.route.length; i++) {
                coordsOfPath[i] = nodes[routeObj.route[i]].coords;
            }
            paintedPath.setPath(coordsOfPath);
            paintedPath.setMap(map);
        }
    });
}