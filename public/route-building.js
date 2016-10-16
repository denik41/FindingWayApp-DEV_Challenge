function getLength(start, finish) {
    return Math.sqrt((finish.lat - start.lat) * (finish.lat - start.lat) + (finish.lng - start.lng) * (finish.lng - start.lng));
}

function createDistanceMatrix(nodes) {
    var matrix = [];
    for (var i = 0; i < nodes.length; i++) {
        matrix[i] = [];
        for (var j = 0; j < nodes.length; j++) {
            if (j == i) {
                matrix[i][j] = 0;
                continue;
            }
            matrix[i][j] = 0;
            for (var k = 0; k < nodes[i].relatedNodes.length; k++) {
                if (nodes[i].relatedNodes[k] == nodes[j].name) {
                    matrix[i][j] = getLength(nodes[i].coords, nodes[j].coords);
                    break;
                }
            }
        }
    }
    return matrix;
}

function findRoute(matrix, startNode, finishNode) {
    var startIndex = nodes.indexOf(startNode);
    var finishIndex = nodes.indexOf(finishNode);
    var lengthOfRoute = [], nodesOfRoute = [];
    var isVisited = [];
    var inf = 100000, index = 0;

    for (var i = 0; i < nodes.length; i++) {
        lengthOfRoute[i] = inf;
        isVisited[i] = false;
        nodesOfRoute[i] = startIndex;
    }
    lengthOfRoute[startIndex] = 0;
    nodesOfRoute[startIndex] = 0;

    for (var count = 0; count < nodes.length - 1; count++) {
        var min = inf;
        for (i = 0; i < nodes.length; i++) {
            if (!isVisited[i] && lengthOfRoute[i] <= min) {
                min = lengthOfRoute[i];
                index = i;
            }
        }
        var k = index;
        isVisited[k] = true;
        for (i = 0; i < nodes.length; i++)
            if (!isVisited[i] && matrix[k][i] != 0 && lengthOfRoute[k] != inf && lengthOfRoute[i] > lengthOfRoute[k] + matrix[k][i]) {
                lengthOfRoute[i] = lengthOfRoute[k] + matrix[k][i];
                nodesOfRoute[i] = k;
            }
    }

    if (lengthOfRoute[finishIndex] == inf) return null;
    else {
        var route = [];
        route[0] = finishIndex;
        finishIndex = nodesOfRoute[finishIndex];
        index = 1;
        while (finishIndex != 0) {
            route[index] = finishIndex;
            finishIndex = nodesOfRoute[finishIndex];
            index++;
        }
        route[index] = startIndex;
        return {
            length: lengthOfRoute[finishIndex],
            route: route
        }
    }
}