// Create our Mixins namespace
Game.Mixins = {};

// Define our Moveable mixin
Game.Mixins.Moveable = {
    name: 'Moveable',
    tryMove: function (x, y, z, map) {
        var map = this.getMap();
        // Must use starting z
        var tile = map.getTile(x, y, this.getZ());
        var target = map.getEntityAt(x, y, this.getZ());
        // If our z level changed, check if we are on stair
        if (z < this.getZ()) {
            if (tile = Game.Tile.stairsUpTile) {
                this.setPosition(x, y, z);
            }
        } else if (z > this.getZ()) {
            if (tile = Game.Tile.stairsDownTile) {
                this.setPosition(x, y, z);
            }
            // If an entity was present at the tile
        } else if (target) {
            // If we are an attacker, try to attack
            // the target
            if (this.hasMixin('Attacker')) {
                this.attack(target);
                return true;
            } else {
                // If not nothing we can do, but we can't
                // move to the tile
                return false;
            }
            // Check if we can walk on the tile
            // and if so simply walk onto it
        } else if (tile.isWalkable()) {
            // Update the entity's position
            this.setPosition(x, y, z);
            return true;
            // Check if the tile is diggable, and
            // if so try to dig it
        } else if (tile.isDiggable()) {
            map.dig(x, y, z);
            return true;
        }
        return false;
    }
};


// Main player's actor mixin
Game.Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function () {
        // Detect if the game is over
        if (this.getHp() < 1) {
            Game.Screen.playScreen.setGameEnded(true);
            // Send a last message to the player
            Game.sendMessage(this, 'You died... Press [enter] (or F for pay respects) and play again!');
        }
        // Re-render the screen
        Game.refresh();
        // Lock the engine and wait asynchronously
        // for the player to press a key.
        this.getMap().getEngine().lock();
        // Clear the message queue
        this.clearMessages();
    }
};

Game.Mixins.FungusActor = {
    name: 'FungusActor',
    groupName: 'Actor',
    init: function () {
        this._growthsRemaining = 5;
    },
    act: function () {
        // Check if we are going to try growing this turn
        if (this._growthsRemaining > 0) {
            if (Math.random() <= 0.02) {
                // Generate the coordinates of a random adjacent square by
                // generating an offset between [-1, 0, 1] for both the x and
                // y directions. To do this, we generate a number from 0-2 and then
                // subtract 1.
                var xOffset = Math.floor(Math.random() * 3) - 1;
                var yOffset = Math.floor(Math.random() * 3) - 1;
                // Make sure we aren't trying to spawn on the same tile as us
                if (xOffset != 0 || yOffset != 0) {
                    // Check if we can actually spawn at that location, and if so
                    // then we grow!
                    if (this.getMap().isEmptyFloor(this.getX() + xOffset,
                            this.getY() + yOffset,
                            this.getZ())) {
                        var entity = new Game.Entity(Game.FungusTemplate);
                        entity.setPosition(this.getX() + xOffset, this.getY() + yOffset, this.getZ());
                        this.getMap().addEntity(entity);
                        this._growthsRemaining--;
                        // Send a message nearby!
                        Game.sendMessageNearby(this.getMap(),
                            entity.getX(), entity.getY(), entity.getZ(),
                            ' ');
                    }
                }
            }
        }
    }
};

// An entity that simply wanders around.
Game.Mixins.WanderActor = {
    name: 'WanderActor',
    groupName: 'Actor',
    act: function () {
        // Flip coin to determine if moving by 1 in the positive or negative direction
        var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
        // Flip coin to determine if moving in x direction or y direction
        if (Math.round(Math.random()) === 1) {
            this.tryMove(this.getX() + moveOffset, this.getY(), this.getZ());
        } else {
            this.tryMove(this.getX(), this.getY() + moveOffset, this.getZ());
        }
    }
};

// This signifies our entity can attack basic destructible enities
Game.Mixins.Attacker = {
    name: 'Attacker',
    groupName: 'Attacker',
    init: function (template) {
        this._attackValue = template['attackValue'] || 1;
    },
    getAttackValue: function () {
        return this._attackValue;
    },
    attack: function (target) {
        // If the target is destructible, calculate the damage
        // based on attack and defense value
        if (target.hasMixin('Destructible')) {
            var attack = this.getAttackValue();
            var defense = target.getDefenseValue();
            var max = Math.max(0, attack - defense);
            var damage = 1 + Math.floor(Math.random() * max);
            console.log("Damage are " + damage)
            Game.sendMessage(this, 'You hit %s with all your heart and did %d damage!',
        [target.getName(), damage]);
            Game.sendMessage(target, '%s generously weighed you and inflicted %d damage!',
        [this.getName(), damage]);

            target.takeDamage(this, damage);
        }
    }
};

// This mixin signifies an entity can take damage and be destroyed
Game.Mixins.Destructible = {
    name: 'Destructible',
    init: function (template) {
        this._maxHp = template['maxHp'] || 10;
        // We allow taking in health from the template incase we want
        // the entity to start with a different amount of HP than the
        // max specified.
        this._hp = template['hp'] || this._maxHp;
        this._defenseValue = template['defenseValue'] || 0;
    },
    getDefenseValue: function () {
        return this._defenseValue;
    },
    getHp: function () {
        return this._hp;
    },
    getMaxHp: function () {
        return this._maxHp;
    },
    takeDamage: function (attacker, damage) {
        this._hp -= damage;
        // If have 0 or less HP, then remove ourseles from the map
        if (this._hp <= 0) {
            Game.sendMessage(attacker, 'You destroyed %s!', [this.getName()]);
            var namecheck = this.getName();
            console.log(namecheck + " killed");
            if (namecheck == 'Final boss') {
                Game.switchScreen(Game.Screen.winScreen);
            }
            if (namecheck == 'исцеляющее зелье') {
                Game.Screen.playScreen._player._hp = Game.Screen.playScreen._player._hp + 20;
            }
            if (namecheck == 'большое исцеляющее зелье') {
                Game.Screen.playScreen._player._hp = Game.Screen.playScreen._player._maxHp;
            }
            if (namecheck == 'chest') {
                var fromChest = getRandomInt(4);
                var randHealth = getRandomInt(100);
                switch (fromChest) {
                    default:
                        Game.Screen.playScreen._player._maxHp = Game.Screen.playScreen._player._maxHp + randHealth;
                        break;
                    case 0:
                        Game.Screen.playScreen._player._hp = Game.Screen.playScreen._player._maxHp;
                        break;
                    case 1:
                        Game.Screen.playScreen._player._sightRadius = Game.Screen.playScreen._player._sightRadius + 2;
                        break;
                    case 2:
                        Game.Screen.playScreen._player._attackValue = Game.Screen.playScreen._player._attackValue + randHealth;
                        break;
                    case 3:
                        Game.Screen.playScreen._player._defenseValue = Game.Screen.playScreen._player._defenseValue + 10;
                        break;
                }

            }

            // Check if the player died, and if so call their act method to prompt the user.
            if (this.hasMixin(Game.Mixins.PlayerActor)) {
                this.act();
            } else {
                this.getMap().removeEntity(this);
            }

        }
    }
};

Game.Mixins.MessageRecipient = {
    name: 'MessageRecipient',
    init: function (template) {
        this._messages = [];
    },
    receiveMessage: function (message) {
        this._messages.push(message);
    },
    getMessages: function () {
        return this._messages;
    },
    clearMessages: function () {
        this._messages = [];
    }
};

// This signifies our entity posseses a field of vision of a given radius.
Game.Mixins.Sight = {
    name: 'Sight',
    groupName: 'Sight',
    init: function (template) {
        this._sightRadius = template['sightRadius'] || 5;
    },
    getSightRadius: function () {
        return this._sightRadius;
    }
};

// Message sending functions
Game.sendMessage = function (recipient, message, args) {
    // Make sure the recipient can receive the message
    // before doing any work.
    if (recipient.hasMixin(Game.Mixins.MessageRecipient)) {
        // If args were passed, then we format the message, else
        // no formatting is necessary
        if (args) {
            message = vsprintf(message, args);
        }
        recipient.receiveMessage(message);
    }
};
Game.sendMessageNearby = function (map, centerX, centerY, centerZ, message, args) {
    // If args were passed, then we format the message, else
    // no formatting is necessary
    if (args) {
        message = vsprintf(message, args);
    }
    // Get the nearby entities
    entities = map.getEntitiesWithinRadius(centerX, centerY, centerZ, 5);
    // Iterate through nearby entities, sending the message if
    // they can receive it.
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].hasMixin(Game.Mixins.MessageRecipient)) {
            entities[i].receiveMessage(message);
        }
    }
};


// Player template
Game.PlayerTemplate = {
    character: '@',
    foreground: 'white',
    maxHp: 10,
    attackValue: 6,
    sightRadius: 6,
    defenseValue: 5,
    mixins: [Game.Mixins.PlayerActor,
    Game.Mixins.Attacker, Game.Mixins.Destructible,
    Game.Mixins.Sight, Game.Mixins.MessageRecipient
  ]
};

Game.FungusTemplate = {
    name: 'гриб',
    character: 'F',
    foreground: 'green',
    maxHp: 100000000000000,
    mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructible]
};

Game.BatTemplate = {
    name: 'bat',
    character: 'b',
    foreground: 'white',
    maxHp: 5,
    attackValue: 4,
    mixins: [Game.Mixins.WanderActor,
    Game.Mixins.Attacker, Game.Mixins.Destructible
  ]
};

Game.BatTemplate = {
    name: 'chest',
    character: 'c',
    foreground: 'yellow',
    maxHp: 1,
    attackValue: 0,
    mixins: [Game.Mixins.Destructible]
};

Game.BatTemplate = {
    name: 'исцеляющее зелье',
    character: 'h',
    foreground: 'green',
    maxHp: 1,
    attackValue: 0,
    mixins: [Game.Mixins.Destructible]
};

Game.BatTemplate = {
    name: 'большое исцеляющее зелье',
    character: 'H',
    foreground: 'green',
    maxHp: 1,
    attackValue: 0,
    mixins: [Game.Mixins.Destructible]
};

Game.NewtTemplate = {
    name: 'zombie',
    character: 'Z',
    foreground: 'green',
    maxHp: 15,
    attackValue: 2,
    mixins: [Game.Mixins.WanderActor,
    Game.Mixins.Attacker, Game.Mixins.Destructible
  ]
};

Game.BatTemplate = {
    name: 'Final boss',
    character: 'B',
    foreground: 'red',
    maxHp: 1000,
    attackValue: 100,
    mixins: [Game.Mixins.WanderActor,
    Game.Mixins.Attacker, Game.Mixins.Destructible
  ]
};
