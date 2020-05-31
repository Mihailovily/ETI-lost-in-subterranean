function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RoomMake() {
    var N = getRandomInt(5, 20); // Размеры комнаты по Y (в коде x)
    var M = getRandomInt(5, 20); // Размеры комнаты по Х (в коде y)
    var x = getRandomInt(20, 30); // Размеры поля
    var y = getRandomInt(20, 30); // Размеры поля
    var storona = getRandomInt(1, 4);
    var sq = createArray(N, M);
    var border = '#'; // границы
    var freeSpace = '.'; // свободное место
    for (var i; i < x; i++) {
        for (var j; j < y; j++) {
            sq[i][j] = freeSpace;
        }
    }
    var room = createArray(N, M);
}
