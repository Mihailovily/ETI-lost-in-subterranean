var drawMap = function () {
    int step = 0; // Включить или выключить поэтапную рисовку карты
    Boolean stop = false;
    int speed = 100; // Скорость воспроизведения: 100 - Макс, 0 - Мин
    int number = 45; // Число комнат
    int RoomX[number];
    int RoomW[number];
    int RoomH[number];
    int RoomY[number];
    int currentRoom;
    int x;
    int y;
    int w;
    int h;
    Boolean splitH;
    int Min = 3; // Минимальная ширина и высота
    int Max = 8; // Максимальная ширина и высота

    int N = 40; // Размеры карты по Y (в коде x)
    int M = 100; // Размеры карты по Х (в коде y)

    char grid[N][M];

    char border = '#';
    char freeSpace = '\0';
    char prefab = 'x';

    void Draw();
    Boolean around(int X, int Y, int W, int H);
    Boolean checkTile(int X, int Y, int W, int H);
    void GenerateBorders();
    void GenerateRoom();
    void GenerateCoridors();
    void Sort();

    int main() {

        srand(time(0));
        do {
            GenerateBorders();
            GenerateRoom();
            if (!step)
                Draw();

        } while (_getch() != 'x');
        return 0;
    }

    void GenerateBorders() {

        for (int i = 0; i < N; i++) {
            for (int j = 0; j < M; j++) {
                if (i == 0 || i == N - 1) {
                    grid[i][j] = border;
                } else if (j == 0 || j == M - 1) {
                    grid[i][j] = border;
                } else grid[i][j] = freeSpace;
            }
        }

    }

    void Draw() {
        system("cls");
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < M; j++) {
                if (j == M - 1)
                    cout << grid[i][j] << endl;
                else cout << grid[i][j];
            }
        }
        if (step) {
            cout << "Number of Rooms:" << number << "\nCurrent Room:" << currentRoom;
            cout << "\nSplitH=" << splitH;
            cout << "\nCurrent Width=" << w << "\nCurrent Height=" << h << endl;

        }
        if (!step || stop) {
            for (int i = 0; i < number; i++) {
                if (i % 2 != 0) {
                    cout << i + 1 << " Room Coordinates: (X=" << RoomX[i] << " ;Y=" << RoomY[i] << ")" <<
                        " Room Sizes: (W=" << RoomW[i] << " :H=" << RoomH[i] << ")" << endl;
                } else cout << i + 1 << " Room Coordinates: (X=" << RoomX[i] << " ;Y=" << RoomY[i] << ")" <<
                    " Room Sizes: (W=" << RoomW[i] << " :H=" << RoomH[i] << ")" << "  ";
            }
        }
        if (!step || stop) {
            cout << "\n\nPress Any Key to Re-Create Map and X - to Exit";
        }
        if (speed > 100) {
            speed = 100;
        } else if (speed < 0)
            speed = 0;
        Sleep(100 - speed);

    }

    void GenerateRoom() {
        for (int a = 0; a < number; a++) {
            splitH = rand() % 100 > 50;

            w = rand() % (Max + 1 - Min) + Min;
            h = rand() % (Max + 1 - Min) + Min;

            x = rand() % (N - 3 - w) + 1;
            y = rand() % (M - 3 - h) + 1;

            if (!splitH) {
                int temp;
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
                for (int i = x; i < w + x; i++) {
                    for (int j = y; j < h + y; j++) {

                        grid[i][j] = prefab;
                        if (j == h + y - 1 && i == w + x - 1 && a == number - 1)
                            stop = true;
                        if (step)
                            Draw(); //Расскоментировать, если нужно поэтапная рисовка карты.
                    }
                }
            } else a--;
        }
        currentRoom = 0;

    }

    Boolean around(int X, int Y, int W, int H) {
        Boolean check;
        for (int i = Y; i < H + Y; i++) {
            if (grid[X - 1][i] == freeSpace)
                check = true;
            else return false;
        }
        for (int i = Y; i < H + Y; i++) {
            if (grid[X + W + 1][i] == freeSpace)
                check = true;
            else return false;
        }
        for (int i = X; i < W + X; i++) {
            if (grid[i][Y - 1] == freeSpace)
                check = true;
            else return false;
        }
        for (int i = X; i < W + X; i++) {
            if (grid[i][Y + H + 1] == freeSpace)
                check = true;
            else return false;
        }
        return true;
    }

    Boolean checkTile(int X, int Y, int W, int H) {
        Boolean check;
        for (int i = X; i < X + W; i++) {
            for (int j = Y; j < Y + H; j++) {
                if (grid[i][j] == prefab)
                    return false;
                else continue;
            }
        }
        return true;
    }

    void GenerateCoridors() {


    }

    void Sort() {

    }
}
