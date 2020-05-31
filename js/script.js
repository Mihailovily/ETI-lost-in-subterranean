function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}
$(document).ready(function () {

            var step = 1; // Включить или выключить поэтапную рисовку карты
            var stop = 0;
            var seeFirst = 1; // Левый верхний угол комнаты - включить для отображения
            var speed = 100; // Скорость воспроизведения: 100 - Макс, 0 - Мин
            var number = 5; // Число комнат
            var RoomX = createArray(5);;
            var RoomW = createArray(5);
            var RoomH = createArray(5);
            var RoomY = createArray(5);
            var currentRoom;
            var x;
            var y;
            var w;
            var h;
            var splitH;
            var Min = 2; // Минимальная ширина и высота
            var Max = 3; // Максимальная ширина и высота
            var distanceX;
            var RaycastDir;
            var distanceY;
            var RaycastStartX;
            var RaycastStartY;
            var N = 50; // Размеры карты по Y (в коде x)
            var M = 50; // Размеры карты по Х (в коде y)

            var grid = createArray(N, M);

            var border = '#'; // границы
            var freeSpace = '\0'; // свободное место
            var first = 'O'; // символ отображения левого верхнего угла комнаты
            var prefab = 'X'; // пол
            var test = 0;

            function Draw();
            //bool around(var X,
            //   var Y,
            //       var W,
            //           var H);
            // bool checkTile(var X,
            //     var Y,
            //        var W,
            //          var H);

            function GenerateBorders();

            function GenerateRoom();

            function GenerateCoridors();

            function Sort();

            function RayCast();

            function main() {
                if (number * Min * Max >= N * M)
                    exit(0);
                srand(time(0));
                do {
                    GenerateBorders();
                    GenerateRoom();
                    RayCast();
                    if (!step) {
                        Draw();
                        test = 0;
                    }

                } while (_getch() != 'x');
                return 0;
            }

            function GenerateBorders() {

                for (var i = 0; i < N; i++) {
                    for (var j = 0; j < M; j++) {
                        if (i == 0 || i == N - 1) {
                            grid[i][j] = border;
                        } else if (j == 0 || j == M - 1) {
                            grid[i][j] = border;
                        } else grid[i][j] = freeSpace;
                    }
                }

            }

            function Draw() {
                system("cls");
                for (var i = 0; i < N; i++) {
                    for (var j = 0; j < M; j++) {
                        if (j == M - 1)
                            cout << grid[i][j] << endl;
                        else cout << grid[i][j];
                        if (grid[i][j] == freeSpace)
                            test++;
                    }
                }
                if (step) {
                    cout << "Number of Rooms:" << number << "\nCurrent Room:" << currentRoom;
                    cout << "\nSplitH=" << splitH;
                    cout << "\nCurrent Width=" << w << "\nCurrent Height=" << h << endl;


                }
                if (!step || stop) {
                    for (var i = 0; i < number; i++) {
                        if (i % 2 != 0) {
                            cout << i + 1 << " Room Coordinates: (X=" << RoomX[i] << " ;Y=" << RoomY[i] << ")" <<
                                " Room Sizes: (W=" << RoomW[i] << " :H=" << RoomH[i] << ")" << endl;
                        } else cout << i + 1 << " Room Coordinates: (X=" << RoomX[i] << " ;Y=" << RoomY[i] << ")" <<
                            " Room Sizes: (W=" << RoomW[i] << " :H=" << RoomH[i] << ")" << "  ";
                    }
                }
                if (!step || stop) {
                    cout << "\nRaycast's X:" << RaycastStartX << " Raycast's Y:" << RaycastStartY << " Raycast's Direction - " << RaycastDir;
                    cout << "\nFree Space now is " << test;
                    cout << "\n\nPress Any Key to Re-Create Map and X - to Exit";
                }
                if (speed > 100) {
                    speed = 100;
                } else if (speed < 0)
                    speed = 0;
                Sleep(100 - speed);

            }

            function GenerateRoom() {
                for (var a = 0; a < number; a++) {
                    splitH = rand() % 100 > 50;

                    w = rand() % (Max + 1 - Min) + Min;
                    h = rand() % (Max + 1 - Min) + Min;

                    x = rand() % (N - 3 - w) + 1;
                    y = rand() % (M - 3 - h) + 1;

                    if (!splitH) {
                        var temp;
                        temp = w;
                        w = h;
                        h = temp;
                    }

                    if (checkTile(x, y, w, h) && around(x, y, w, h)) {
                        currentRoom++;
                        RoomX[a] = x;
                        RoomY[a] = y;
                        RoomH[a] = h;
                        RoomW[a] = w;
                        for (var i = x; i < w + x; i++) {
                            for (var j = y; j < h + y; j++) {
                                if (i == x && j == y && seeFirst) {
                                    grid[i][j] = first;
                                } else grid[i][j] = prefab;
                                if (j == h + y - 1 && i == w + x - 1 && a == number - 1)
                                    stop = true;
                                if (step) {
                                    Draw(); //Расскоментировать, если нужно поэтапная рисовка карты.
                                    test = 0;
                                }
                            }
                        }
                    } else a--;
                }
                currentRoom = 0;

            }

            bool around(var X,
                var Y,
                    var W,
                        var H) {
                bool check;
                for (var i = Y; i < H + Y; i++) {
                    if (grid[X - 1][i] == freeSpace)
                        check = true;
                    else return false;
                }
                for (var i = Y; i < H + Y; i++) {
                    if (grid[X + W + 1][i] == freeSpace)
                        check = true;
                    else return false;
                }
                for (var i = X; i < W + X; i++) {
                    if (grid[i][Y - 1] == freeSpace)
                        check = true;
                    else return false;
                }
                for (var i = X; i < W + X; i++) {
                    if (grid[i][Y + H + 1] == freeSpace)
                        check = true;
                    else return false;
                }
                return true;
            }

            bool checkTile(var X,
                var Y,
                    var W,
                        var H) {
                bool check;
                for (var i = X; i < X + W; i++) {
                    for (var j = Y; j < Y + H; j++) {
                        if (grid[i][j] == prefab)
                            return false;
                        else continue;
                    }
                }
                return true;
            }

            function GenerateCoridors() {


            }

            function RayCast() {
                RaycastDir = rand() % 3 + 1;
                var range = 0;
                switch (RaycastDir) {
                    case 1: {
                        RaycastStartX = RoomX[0];
                        range = rand() % RoomH[0];
                        RaycastStartY = RoomY[0] + range;
                        break;
                    }
                    case 2: {
                        RaycastStartY = RoomY[0];
                        range = rand() % RoomW[0];
                        RaycastStartX = RoomX[0] + range;
                        break;
                    }
                    case 3: {
                        RaycastStartX = RoomX[0] + RoomW[0] - 1;
                        range = rand() % RoomH[0];
                        RaycastStartY = RoomY[0] + range;
                        break;
                    }
                    case 4: {
                        RaycastStartY = RoomY[0] + RoomH[0] - 1;
                        range = rand() % RoomW[0];
                        RaycastStartX = RoomX[0] + range;
                        break;
                    }
                }
                grid[RaycastStartX][RaycastStartY] = '@';
            }


        }
