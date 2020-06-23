Game.Screen = {};
var isCodeUsed = 0;
// Define our initial start screen
Game.Screen.startScreen = {
    enter: function () {
        console.log("Открыт стартовый экран");

    },
    exit: function () {
        console.log("Закрыт стартовый экран");
    },
    render: function (display) {
        // Render our prompt to the screen
        display.drawText(1, 1, "%c{red}ETI представляет");
        display.drawText(1, 2, "%c{yellow}ETI : lost in subterranean");
        display.drawText(1, 3, "Что бы включить саундрек к игре, нажми [y] или жми [n] и погнали без звука!");
    },
    handleInput: function (inputType, inputData) {
        // When [Enter] is pressed, go to the play screen
        if (inputType === 'keydown') {
            if (inputData.keyCode === 20) {
              isCodeUsed = 1;
                console.log("Использован код");
            }
            else {
                isCodeUsed = 0;
            }
            if (inputData.keyCode === 78) {
                Game.switchScreen(Game.Screen.playScreen);
            } else {
                if (inputData.keyCode === 89) {
                    backaudio.src = "Mac-Quayle-20-1-s4ve-the-w0rldact.mp3";
                    Game.switchScreen(Game.Screen.playScreen);
                }
            }
        }
    }
};
// Define our playing screen
Game.Screen.playScreen = {
    _map: null,
    _player: null,
    _gameEnded: false,
    enter: function () {
        // Create a map based on our size parameters
        var width = 140;
        var height = 348;
        var depth = 1;
        if (isCodeUsed = 1) {
            console.log("Сессия с читами запущена");
            Game.PlayerTemplate.maxHp = 400;
        }
        // Create our map from the tiles and player
        var tiles = new Game.Builder(width, height, depth).getTiles();
        this._player = new Game.Entity(Game.PlayerTemplate);
        this._map = new Game.Map(tiles, this._player);
        //this._map = new Game.Map(map, this._player);
        // Start the map's engine
        this._map.getEngine().start();
    },
    exit: function () {
        console.log("Закрыт игровой экран");
    },
    render: function (display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        // Make sure the x-axis doesn't go to the left of the left bound
        var topLeftX = Math.max(0, this._player.getX() - (screenWidth / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._map.getWidth() - screenWidth);
        // Make sure the y-axis doesn't above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (screenHeight / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight);
        // This object will keep track of all visible map cells
        var visibleCells = {};
        // Store this._map and player's z to prevent losing it in callbacks
        var map = this._map;
        var currentDepth = this._player.getZ();
        // Find all visible cells and update the object
        map.getFov(currentDepth).compute(
            this._player.getX(), this._player.getY(),
            this._player.getSightRadius(),
            function (x, y, radius, visibility) {
                visibleCells[x + "," + y] = true;
                // Mark cell as explored
                map.setExplored(x, y, currentDepth, true);
            });
        // Render the explored map cells
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                if (map.isExplored(x, y, currentDepth)) {
                    // Fetch the glyph for the tile and render it to the screen
                    // at the offset position.
                    var tile = this._map.getTile(x, y, currentDepth);
                    // The foreground color becomes dark gray if the tile has been
                    // explored but is not visible
                    var foreground = visibleCells[x + ',' + y] ?
                        tile.getForeground() : 'darkGray';
                    display.draw(
                        x - topLeftX,
                        y - topLeftY,
                        tile.getChar(),
                        foreground,
                        tile.getBackground());
                }
            }
        }
        // Render the entities
        var entities = this._map.getEntities();
        for (var key in entities) {
            var entity = entities[key];
            // Only render the entitiy if they would show up on the screen
            if (entity.getX() >= topLeftX && entity.getY() >= topLeftY &&
                entity.getX() < topLeftX + screenWidth &&
                entity.getY() < topLeftY + screenHeight &&
                entity.getZ() == this._player.getZ()) {
                if (visibleCells[entity.getX() + ',' + entity.getY()]) {
                    display.draw(
                        entity.getX() - topLeftX,
                        entity.getY() - topLeftY,
                        entity.getChar(),
                        entity.getForeground(),
                        entity.getBackground()
                    );
                }
            }
        }
        // Get the messages in the player's queue and render them
        var messages = this._player.getMessages();
        var messageY = 0;
        for (var i = 0; i < messages.length; i++) {
            // Draw each message, adding the number of lines
            messageY += display.drawText(
                0,
                messageY,
                '%c{white}%b{black}' + messages[i]
            );
        }
        // Render player HP
        var stats = '%c{white}%b{black}';
        stats += vsprintf('Здоровье: %d/%d ', [this._player.getHp(), this._player.getMaxHp()]);
        display.drawText(0, screenHeight, stats);
    },
    handleInput: function (inputType, inputData) {
        // If the game is over, enter will bring the user to the losing screen.
        if (this._gameEnded) {
            if (inputType === 'keydown' && inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.loseScreen);
            }
            // Return to make sure the user can't still play
            return;
        }
        if (inputType === 'keydown') {
            console.log("Нажата клавиша №" + inputData.keyCode)
            // Movement
            if (inputData.keyCode === ROT.VK_LEFT) {
                this.move(-1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                this.move(1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_UP) {
                this.move(0, -1, 0);
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                this.move(0, 1, 0);
            } else {
                // Not a valid key
                return;
            }
            // Unlock the engine
            this._map.getEngine().unlock();

        } else if (inputType === 'keypress') {
            var keyChar = String.fromCharCode(inputData.charCode);
            if (keyChar === '>') {
                this.move(0, 0, 1);
            } else if (keyChar === '<') {
                this.move(0, 0, -1);
            } else {
                // Not a valid key
                return;
            }
            // Unlock the engine
            this._map.getEngine().unlock();
        }
    },
    move: function (dX, dY, dZ) {
        var newX = this._player.getX() + dX;
        var newY = this._player.getY() + dY;
        var newZ = this._player.getZ() + dZ;
        // Try to move to the new cell
        this._player.tryMove(newX, newY, newZ, this._map);
    },
    setGameEnded: function (gameEnded) {
        this._gameEnded = gameEnded;
    }
};

// Define our winning screen
Game.Screen.winScreen = {
    enter: function () {
        console.log("Игрок выиграл. Открыт экран победы");
    },
    exit: function () {
        console.log("Закрыыт экран победы");
    },
    render: function (display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            // Generate random background colors
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            var background = ROT.Color.toRGB([r, g, b]);
            display.drawText(2, i + 1, "%b{" + background + "}Ты выиграл!");
        }
    },
    handleInput: function (inputType, inputData) {
        // Nothing to do here
    }
};

// Define our winning screen
Game.Screen.loseScreen = {
    enter: function () {
        console.log("Игрок проиграл. Открыт экран поражения");
    },
    exit: function () {
        console.log("Закрыт экран поражения");
    },
    render: function (display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}Ты проиграл! Давай по-новой :(");
        }
    },
    handleInput: function (inputType, inputData) {
        // Nothing to do here
    }
};
