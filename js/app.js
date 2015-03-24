'use strict';

var frogger;
var player;
var map;
var allEnemies;
var currentLevel = 1;
var key;
var gems;
var score = [];
for (var i = 0, stopCondition = Object.keys(gameData).length; i < stopCondition; i++) {
    score[i] = 0;
}
var CANVAS_WITH = 505;
var CANVAS_HEIGHT = 606;
var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    13: 'enter'
};

var timer = 0;

/**
 * Represents a Finite State Machine.
 * @class FiniteStateMachine
 * @constructor
 */
function FiniteStateMachine() {
    this.states = {};
    this.currentState = "";
    this.previousState = "";
}

/**
 * Add a new state to the states variable.
 * @method addState
 * @param {string} stateName - The name of the state.
 * @param {object} stateObject - The instance of the state object.
 * @param {array} statesAllowed - Array of state names that are allowed to switch.
 */
FiniteStateMachine.prototype.addState = function (stateName, stateObject, statesAllowed) {
    this.states[stateName] = {
        "stateName": stateName,
        "stateObject": stateObject,
        "statesAllowed": statesAllowed
    };
};

/**
 * Set the current state
 * @method setState
 * @param {string} stateName - The name of the state to be set.
 */
FiniteStateMachine.prototype.setState = function (stateName) {
    if (this.currentState === "") {
        this.currentState = stateName;
        this.states[this.currentState].stateObject.enter();
        return;
    }
    if (this.currenState === stateName) {
        console.log("the actor is already in this state");
        return;
    }
    if (this.states[this.currentState].statesAllowed.indexOf(stateName) > -1) {
        this.states[this.currentState].stateObject.exit();
        this.previousState = this.currentState;
        this.currentState = stateName;
    } else {
        console.log("you are not allowed to switch to that " + stateName + "state being in " + this.currentState + "state");
    }
    this.states[this.currentState].stateObject.enter();
};

/**
 * Calls the update method of the current state.
 * @method update
 * @param {number} dt - time delta information.
 */
FiniteStateMachine.prototype.update = function (dt) {
    this.states[this.currentState].stateObject.update(dt);
};

/**
 * Represents a TileMap.
 * @class TileMap
 * @constructor
 * @param {number} x - the x coordinate where to place the image
 * @param {number} y - the y coordinate where to place the image
 * @param {string} sprite - the image url to be drawn
 */
function TileMap(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.width = 101;
    this.height = 83;
    this.sprite = sprite;
}

/**
 * Render the image using the x and y attributes.
 * @method render
 */
TileMap.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x * this.width, this.y * this.height);
};

/**
 * Represents a WaterTile inherent from TileMap.
 * @class WaterTile
 * @constructor
 * @param {number} x - the x coordinate where to place the image
 * @param {number} y - the y coordinate where to place the image
 * @param {string} sprite - the image url to be drawn
 */
function WaterTile(x, y, sprite) {
    TileMap.call(this, x, y, sprite);
}

WaterTile.prototype = Object.create(TileMap.prototype);
WaterTile.prototype.constructor = WaterTile;

/**
 * Represents a StoneTile inherent from TileMap.
 * @class StoneTile
 * @constructor
 * @param {number} x - the x coordinate where to place the image
 * @param {number} y - the y coordinate where to place the image
 * @param {string} sprite - the image url to be drawn
 */
function StoneTile(x, y, sprite) {
    TileMap.call(this, x, y, sprite);
}

StoneTile.prototype = Object.create(TileMap.prototype);
StoneTile.prototype.constructor = StoneTile;

/**
 * Represents a GrassTile inherent from TileMap.
 * @class GrassTile
 * @constructor
 * @param {number} x - the x coordinate where to place the image
 * @param {number} y - the y coordinate where to place the image
 * @param {string} sprite - the image url to be drawn
 */
function GrassTile(x, y, sprite) {
    TileMap.call(this, x, y, sprite);
}

GrassTile.prototype = Object.create(TileMap.prototype);
GrassTile.prototype.constructor = GrassTile;

/**
 * Represents a Door inherent from TileMap.
 * @class Door
 * @constructor
 * @param {number} x - the x coordinate where to place the image
 * @param {number} y - the y coordinate where to place the image
 * @param {string} sprite - the image url to be drawn
 */
function Door(x, y, sprite) {
    TileMap.call(this, x, y, sprite);
    this.doorSprite = "images/door.png";
}

Door.prototype = Object.create(TileMap.prototype);
Door.prototype.constructor = Door;

/**
 * Render the image using the x and y attributes.
 * @method render
 */
Door.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x * this.width, this.y * this.height);
    ctx.drawImage(Resources.get(this.doorSprite), this.x * this.width, this.y * this.height - 19);
};


/**
 * Represents a Gem.
 * @class Gem
 * @constructor
 * @param {number} x - the x coordinate where to place the image
 * @param {number} y - the y coordinate where to place the image
 * @param {string} sprite - the image url to be drawn
 * @param {number} time - time before the gem fade in
 * @param {number} value - points
 */
function Gem(x, y, sprite, time, value) {
    this.srcX = 0;
    this.srcY = 50;
    this.width = 101;
    this.height = 121;
    this.drawX = x;
    this.drawY = y;
    this.centerX = this.drawX + (this.width * 0.5);
    this.centerY = this.drawY + (this.height * 0.5);
    this.sprite = sprite;
    this.time = time;
    this.value = value;
    this.liveTime = time;
}

/**
 * Decrease the time and the value of the gem
 * @method update
 */
Gem.prototype.update = function (dt) {
    if (this.time > 0) {
        this.time = this.time - dt;
        this.value = this.value - dt;
    }
};

/**
 * Render the image using the x and y attributes.
 * @method render
 */
Gem.prototype.render = function () {
    if (this.time > 0) {
        ctx.globalAlpha = convertRange(0, this.liveTime, 0, 1, this.time);
        ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
        ctx.globalAlpha = 1;
    }
};

/**
 * Represents a Key.
 * @class Key
 * @constructor
 * @param {number} x - the x coordinate where to place the image
 * @param {number} y - the y coordinate where to place the image
 * @param {number} value - points
 */
function Key(x, y, value) {
    this.srcX = 20;
    this.srcY = 52;
    this.width = 60;
    this.height = 100;
    this.widthScale = 30;
    this.heightScale = this.widthScale / (this.width / this.height);
    this.drawX = x;
    this.drawY = y;
    this.centerX = this.drawX + (this.width * 0.5);
    this.centerY = this.drawY + (this.height * 0.5);
    this.value = value;
    this.sprite = "images/key.png";
}

/**
 * Set the position of the key
 * @method init
 * @param {number} x - the x coordinate where to place the image
 * @param {number} y - the y coordinate where to place the image
 */
Key.prototype.init = function (x, y) {
    this.drawX = x;
    this.drawY = y;
    this.centerX = this.drawX + (this.width * 0.5);
    this.centerY = this.drawY + (this.height * 0.5);
};

/**
 * Decrease the value of the key
 * @method update
 * @param {number} dt - time delta information
 */
Key.prototype.update = function (dt) {
    this.value = this.value - dt;
};

/**
 * Render the key on the map or next to the player
 * @method render
 */
Key.prototype.render = function () {
    if (!player.key) {
        ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    } else {
        this.drawX = player.drawX;
        this.drawY = player.drawY + (player.height - this.heightScale);
        this.centerX = this.drawX + (this.widthScale * 0.5);
        this.centerY = this.drawY + (this.heightScale * 0.5);
        ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.widthScale, this.heightScale);
    }
};

/**
 * Represents a Enemy.
 * @class Enemy
 * @constructor
 * @param {number} x - the x coordinate where to place the image
 * @param {number} y - the y coordinate where to place the image
 * @param {number} velocity - the velocity of the enemy
 */
function Enemy(x, y, velocity) {
    this.sprite = "images/enemy-bug.png";
    this.srcX = 0;
    this.srcY = 70;
    this.width = 101;
    this.height = 83;
    this.drawX = x;
    this.drawY = y;
    this.centerX = this.drawX + (this.width * 0.5);
    this.centerY = this.drawY + (this.height * 0.5);
    this.velocity = velocity;
}


/**
 * Increase the x coordinate.
 * @method update
 */
Enemy.prototype.update = function (dt) {
    this.drawX = (this.drawX > ctx.canvas.width) ? (-1 * this.width) : (this.drawX + (this.velocity * dt));
    this.centerX = this.drawX + (this.width * 0.5);
    this.centerY = this.drawY + (this.height * 0.5);
};

/**
 * Render the image of the enemy
 * @method render
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

/**
 * Represents a Player.
 * @class Player
 * @constructor
 */
function Player() {
    this.sprite = "images/char-boy.png";
    this.srcX = 0;
    this.srcY = 63;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 101;
    this.height = 83;
    this.centerX = this.drawX + (this.width * 0.5);
    this.centerY = this.drawY + (this.height * 0.5);
    this.key = false;
    this.numOfLives = 5;
    this.lives = [];
    for (var i = 0; i < this.numOfLives; i++) {
        this.lives.push(new Live(25 * i, 25));
    }
};

/**
 * Update the center point of the player
 * @method update
 */
Player.prototype.update = function () {
    this.centerX = this.drawX + (this.width * 0.5);
    this.centerY = this.drawY + (this.height * 0.5);
};

/**
 * set the position player to the initial position.
 * @method init
 */
Player.prototype.init = function (initialPosition) {
    this.drawX = initialPosition.x;
    this.drawY = initialPosition.y;
    this.centerX = this.drawX + (this.width * 0.5);
    this.centerY = this.drawY + (this.height * 0.5);
    this.key = false;
};

/**
 * Render the player and the calls the render method on the lives objets.
 * @method render
 */
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    ctx.globalAlpha = 1;
    this.lives.forEach(function (live) {
        live.render();
    });
};

/**
 * Verify if the player is allowed to move to the next position.
 * @method checkMovement
 * @param {string} e - string that indicate the key that was pressed
 */
Player.prototype.checkMovement = function (e) {
    var newDrawX = this.drawX;
    var newDrawY = this.drawY;
    switch (e) {
    case "left":
        newDrawX -= this.width;
        break;
    case "right":
        newDrawX += this.width;
        break;
    case "down":
        newDrawY += this.height;
        break;
    case "up":
        newDrawY -= this.height;
        break;
    }
    if (!outOfbound(this, newDrawX, newDrawY) && this.checkCondicion(newDrawX, newDrawY)) {
        this.drawX = newDrawX;
        this.drawY = newDrawY;
    }
};

/**
 * Verify if the player collide with the key
 * @method checkKey
 */
Player.prototype.checkKey = function () {
    if (!this.key) {
        var p = buildPoint(this.centerX, this.centerY);
        var q = buildPoint(key.centerX, key.centerY);
        if (distanceTwoPoint(p, q) < (this.width * 0.5)) {
            player.key = true;
            score[currentLevel - 1] += key.value;
        }
    }
};


/**
 * Vefirify if the player collide with a enemy
 * @method checkCollisionEnemies
 * @return {bool} true if the player collide with a enemy
 */
Player.prototype.checkCollisionEnemies = function () {
    var self = this;
    var result = false;
    allEnemies.forEach(function (enemy) {
        var p = buildPoint(enemy.centerX, enemy.centerY);
        var q = buildPoint(self.centerX, self.centerY);
        if (parseInt(p.y / 83) === parseInt(q.y / 83) && distanceTwoPoint(p, q) < (self.width * 0.81)) {
            if (self.numOfLives > 0) {
                self.lives[self.numOfLives - 1].state = false;
                self.numOfLives--;
            }
            result = !result;
        }
    });
    return result;
};

/**
 * Retrives the number of lifes
 * @method getLives
 * @return {number} num of active lifes
 */
Player.prototype.getLives = function () {
    var total = this.lives.reduce(function (a, b) {
        return (b.state) ? a + 1 : a;
    }, 0);
    return total;
};


/**
 * Verify if the player collide with a gen in that case the gem is removed.
 * @method checkGems
 */
Player.prototype.checkGems = function () {
    var self = this;
    gems.forEach(function (gem, i) {
        if (gem.time > 0) {
            var p = buildPoint(gem.centerX, gem.centerY);
            var q = buildPoint(self.centerX, self.centerY);
            if (parseInt(p.y / 83) === parseInt(q.y / 83) && distanceTwoPoint(p, q) < (self.width * 0.75)) {
                score[currentLevel - 1] += gem.value;
                gems.splice(i, 1);
                return;
            }
        }
    });
};


/**
 * Verify if the player satisfy the condition the go up a level
 * @method checkCondicion
 */
Player.prototype.checkCondicion = function (newDrawX, newDrawY) {
    var row = parseInt(newDrawY / this.height);
    var column = parseInt(newDrawX / this.width);
    if (gameData["level" + currentLevel].end_position.x === row && gameData["level" + currentLevel].end_position.y === column) {
        return this.key
    } else {
        return true;
    }
};


/**
 * Retrives if the player fall down in a water tile
 * @method checkMap
 * @return {bool}
 */
Player.prototype.checkMap = function () {
    var row = parseInt(this.drawY / this.height);
    var column = parseInt(this.drawX / this.width);
    var mapRow = map[row];
    var mapColumn = mapRow[column];
    if (mapColumn instanceof WaterTile && this.numOfLives > 0) {
        this.lives[this.numOfLives - 1].state = false;
        this.numOfLives--;
    }
    return mapColumn instanceof WaterTile;
};


/**
 * Check if the player is on the end position of the level.
 * @method checkLevel
 * @return {bool}
 */
Player.prototype.checkLevel = function () {
    var p = buildPoint(parseInt(this.drawY / 83), parseInt(this.drawX / 83));
    var q = buildPoint(gameData["level" + currentLevel].end_position.x, gameData["level" + currentLevel].end_position.y);
    return p.x == q.x &&
        p.y == q.y;
}

/**
 * Event handler for the player input
 * @method handleInput
 */
Player.prototype.handleInput = function (e) {
    this.checkMovement(e);
};

/**
 * Set the image character of the player
 * @method setSprite
 */
Player.prototype.setSprite = function (sprite) {
    this.sprite = sprite;
}

/**
 * Represents a Live.
 * @class Live
 * @constructor
 */
function Live(x, y) {
    this.sprite = "images/heart.png";
    this.srcX = 0;
    this.srcY = 45;
    this.drawX = x;
    this.drawY = y;
    this.width = 101;
    this.height = 100;
    this.scaleWidth = 25;
    this.scaleHeight = this.scaleWidth / (this.width / this.height);
    this.state = true;
}

/**
 * Render the image
 * @method setSprite
 */
Live.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.scaleWidth, this.scaleHeight);
    if (!this.state) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(this.drawX + this.scaleWidth, this.drawY);
        ctx.lineTo(this.drawX + 4, this.drawY + this.scaleHeight - 4);
        ctx.stroke();
    }
};

/**
 * Represents the Frogger Game.
 * @class Frogger
 * @constructor
 */
function Frogger() {
    this.velocity = 150;
    this.finiteStateMachine = new FiniteStateMachine();
    this.characters = [
            "images/char-boy.png",
            "images/char-cat-girl.png",
            "images/char-horn-girl.png",
            "images/char-pink-girl.png",
            "images/char-princess-girl.png"
        ];
    /** Define the different states that the game ca be in*/
    this.states = {
        "MENU": "MENU",
        "PLAYING": "PLAYING",
        "PAUSED": "PAUSED",
        "LOSING": "LOSING",
        "TRANSITION_LEVEL": "TRANSITION_LEVEL",
        "GAME_OVER": "GAME_OVER",
        "END": "END"
    };
    this.selectedCharacter = 0;
    this.offset = CANVAS_HEIGHT / 2 - 171 / 2;
    /** Add the state to the finite state machine instane */
    this.finiteStateMachine.addState(this.states.MENU, new MenuState(this), ["PLAYING"]);
    this.finiteStateMachine.addState(this.states.PLAYING, new PlayingState(this), ["MENU", "PAUSED", "LOSING", "TRANSITION_LEVEL"]);
    this.finiteStateMachine.addState(this.states.LOSING, new LosingState(this), ["PLAYING", "GAME_OVER"]);
    this.finiteStateMachine.addState(this.states.TRANSITION_LEVEL, new TransitionLevelState(this), ["PLAYING", "END"]);
    this.finiteStateMachine.addState(this.states.GAME_OVER, new GameOverState(this), ["PLAYING", "MENU"]);
    this.finiteStateMachine.addState(this.states.END, new EndGameState(this), ["MENU"]);
    /** Set the initial sate to MENU */
    this.finiteStateMachine.setState(this.states.MENU);
}

/**
 * Calls the update method on the finite state machine
 * @method update
 * @param {number} dt - time delta informaction
 */
Frogger.prototype.update = function (dt) {
    this.finiteStateMachine.update(dt);
};

/**
 * Event handler for the player input
 * @method handleInput
 * @param {string} key - string thta indicate the pressed key
 */
Frogger.prototype.handleInput = function (key) {
    switch (key) {
    case "left":
        this.selectedCharacter = (this.selectedCharacter > 0) ? this.selectedCharacter - 1 : this.selectedCharacter;
        break;
    case "right":
        this.selectedCharacter = (this.selectedCharacter < this.characters.length - 1) ? this.selectedCharacter + 1 : this.selectedCharacter;
        break;
    case "enter":
        this.finiteStateMachine.setState(this.states.PLAYING);
        break;
    default:
        break;
    }
};

/**
 * Reset the game, the level, the score, lives, timer.
 * @method reset
 */
Frogger.prototype.reset = function () {
    timer = 0;
    currentLevel = 1;
    player.numOfLives = 5;
    for (var i = 0, condition = score.length; i < condition; i++) {
        score[i] = 0;
    }
    player.lives.forEach(function (live) {
        live.state = true;
    });
    start();
    this.finiteStateMachine.setState(this.states.MENU);
}

/**
 * Represents a MenuState.
 * @class MenuState
 * @constructor
 * @param {object} actor - the object that has the instance of the finite state machine
 */
function MenuState(actor) {
    this.actor = actor;
}

/**
 * The method gets called when the game enters the state, Add event listener
 * @method enter
 */
MenuState.prototype.enter = function () {
    document.addEventListener("keyup", menuEventHandler, false);
};

/**
 * The method called for the finite state machine
 * @method update
 * @param {number} dt - time delta information
 */
MenuState.prototype.update = function (dt) {
    this.render();
};

/**
 * Render the select character screen
 * @method update
 */
MenuState.prototype.render = function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    renderMap();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.5; // Half opacity
    ctx.fillRect(0, 50, ctx.canvas.width, ctx.canvas.height - 70);
    ctx.globalAlpha = 1;
    // Draw the title
    ctx.font = "42px 'Gloria Hallelujah', cursive, Arial, serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Choose Your Character", ctx.canvas.width / 2, 140);
    // draw selector image
    var self = this.actor;
    this.actor.characters.forEach(function (character, row) {
        if (self.selectedCharacter == row) {
            ctx.drawImage(Resources.get("images/Selector.png"), row * 101, self.offset);
        }
        ctx.drawImage(Resources.get(character), row * 101, self.offset);
    });
};

/**
 * the method gets called before leaving the state, remove the event listener
 * @method exit
 */
MenuState.prototype.exit = function () {
    document.removeEventListener("keyup", menuEventHandler, false);
    player.setSprite(this.actor.characters[this.actor.selectedCharacter]);
};

/**
 * Represents a PlayingState.
 * @class PlayingState
 * @constructor
 * @param {object} actor - the object that has the finite state machine instance
 */
function PlayingState(actor) {
    this.actor = actor;
}

/**
 * The method gets called when the game enters the state, Add event listener
 * @method enter
 */
PlayingState.prototype.enter = function () {
    document.addEventListener("keyup", playingEventHandler, false);
};

/**
 * update the playing state
 * @method update
 * @param {number} dt - time delta information
 */
PlayingState.prototype.update = function (dt) {
    allEnemies.forEach(function (enemy) {
        enemy.update(dt);
    });
    gems.forEach(function (gem) {
        gem.update(dt);
    });
    key.update(dt);
    player.update();
    player.checkKey();
    player.checkGems();
    if (player.checkCollisionEnemies() || player.checkMap()) {
        this.actor.finiteStateMachine.setState(this.actor.states.LOSING);
    }
    if (player.checkLevel()) {
        this.actor.finiteStateMachine.setState(this.actor.states.TRANSITION_LEVEL);
    }
    if (player.getLives() <= 0) {
        this.actor.finiteStateMachine.setState(this.actor.states.GAME_OVER);
    }
    this.render();
};


/**
 * Render the playing state
 * @method render
 */
PlayingState.prototype.render = function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    renderTimeAndScore();
    renderMap();
    renderEnemies();
    renderGems();
    player.render();
    key.render();
};

/**
 * Exit the playing state, remove event listener
 * @method exit
 */
PlayingState.prototype.exit = function () {
    document.removeEventListener("keyup", playingEventHandler, false);
};

/**
 * Represents a LosingState.
 * @class LosingState
 * @constructor
 * @param {object} actor -  the object that has the finite state machine instance
 */
function LosingState(actor) {
    this.actor = actor;
    this.path;
    this.startPonit;
    this.endPoint;
}

/**
 * The method gets called when the game enters the state,
 * set the last player position
 * set the initial position according to the level
 * set the path to move the player
 * reset the level: score, key, gems
 * @method enter
 */
LosingState.prototype.enter = function () {
    this.startPonit = buildPoint(player.drawX, player.drawY);
    this.endPoint = buildPoint(gameData["level" + currentLevel].player_position.x, gameData["level" + currentLevel].player_position.y);
    this.path = construcLineEquation(this.startPonit, this.endPoint);
    player.key = false;
    key.init(
        gameData["level" + currentLevel].key.x,
        gameData["level" + currentLevel].key.y,
        gameData["level" + currentLevel].key.value
    );
    gems = createGems(gameData["level" + currentLevel].gems);
    score[currentLevel - 1] = 0;
};

/**
 * Move the player from the position where he lost to the initial position
 * @method update
 */
LosingState.prototype.update = function (dt) {
    if (this.startPonit.x == this.endPoint.x) {
        player.drawY = player.drawY + this.actor.velocity * dt;
        if (player.drawY >= this.endPoint.y) {
            this.actor.finiteStateMachine.setState(this.actor.states.PLAYING);
        }
    } else if (this.startPonit.y == this.endPoint.y) {
        player.drawX = (this.startPonit.x > this.endPoint.x) ? player.drawX - this.actor.velocity * dt : player.drawX + this.actor.velocity * dt;
        if (this.startPonit.x > this.endPoint.x && player.drawX <= this.endPoint.x) {
            this.actor.finiteStateMachine.setState(this.actor.states.PLAYING);
        } else if (this.startPonit.x < this.endPoint.x && player.drawX >= this.endPoint.x) {
            this.actor.finiteStateMachine.setState(this.actor.states.PLAYING);
        }
    } else {
        player.drawX = (this.startPonit.x > this.endPoint.x) ? player.drawX - this.actor.velocity * dt : player.drawX + this.actor.velocity * dt;
        player.drawY = this.path(player.drawX);
        if (this.startPonit.x > this.endPoint.x && player.drawX <= this.endPoint.x) {
            this.actor.finiteStateMachine.setState(this.actor.states.PLAYING);
        } else if (this.startPonit.x < this.endPoint.x && player.drawX >= this.endPoint.x) {
            this.actor.finiteStateMachine.setState(this.actor.states.PLAYING);
        }
    }
    this.render();
};

/**
 * Render the game scenario: map, enemies, gems, player, key, timer and score.
 * @method render
 */
LosingState.prototype.render = function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    renderTimeAndScore();
    renderMap();
    renderEnemies();
    renderGems();
    ctx.globalAlpha = 0.7;
    player.render();
    ctx.globalAlpha = 1;
    key.render();
}


/**
 *
 * @method exit
 */
LosingState.prototype.exit = function () {
    player.drawX = this.endPoint.x;
    player.drawY = this.endPoint.y;
};

/**
 * Represents a TransitionLevelState.
 * @class TransitionLevelState
 * @constructor
 * @param {object} actor -  the object that has the finite state machine instance
 */
function TransitionLevelState(actor) {
    this.actor = actor;
    this.time;
}

/**
 * The method gets called when the game enters the state,
 * increase the level if is not the laste level.
 * @method enter
 */
TransitionLevelState.prototype.enter = function () {
    this.time = 0;
    if (currentLevel < Object.keys(gameData).length) {
        currentLevel = currentLevel + 1;
    } else {
        this.actor.finiteStateMachine.setState(this.actor.states.END);
    }
};

/**
 * The method called by the finite state machine, wait 2 second before to start the next level
 * @method update
 */
TransitionLevelState.prototype.update = function (dt) {
    this.time++;
    if (this.time >= 120) {
        this.actor.finiteStateMachine.setState(this.actor.states.PLAYING);
    }
    this.render();
};

/**
 * Render the transition level state.
 * @method render
 */
TransitionLevelState.prototype.render = function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    renderMap();
    renderEnemies();
    renderGems();
    player.render();
    key.render();
    renderTimeAndScore();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "black";
    ctx.fillRect(0, ctx.canvas.height / 2 - 50, ctx.canvas.width, 75);
    ctx.globalAlpha = 1;
    ctx.font = "36px 'Gloria Hallelujah', cursive, Arial, serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Level " + currentLevel, ctx.canvas.width / 2, ctx.canvas.height / 2);
};


/**
 * Exit the transition level state, start the next level
 * @method render
 */
TransitionLevelState.prototype.exit = function () {
    if (currentLevel < Object.keys(gameData).length) {
        start();
    }
};

/**
 * Represents a GameOverState.
 * @class GameOverState
 * @constructor
 * @param {object} actor -  the object that has the finite state machine instance
 */
function GameOverState(actor) {
    this.actor = actor;
}

/**
 * Add the event listener
 * @method enter
 */
GameOverState.prototype.enter = function () {
    document.addEventListener("keyup", gameOverEventHandler, false);
};

/**
 * call the render method of the game over state
 * @method update
 */
GameOverState.prototype.update = function (dt) {
    this.render();
};

/**
 * render the game over state
 * @method render
 */
GameOverState.prototype.render = function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    renderMap();
    renderEnemies();
    renderGems();
    renderTimeAndScore();
    player.render();
    key.render();
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 250, ctx.canvas.width, 100);
    ctx.globalAlpha = 1;
    ctx.font = "48px 'Gloria Hallelujah', cursive, Arial, serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.font = "18px 'Gloria Hallelujah', cursive, Arial, serif";
    ctx.fillText("Press ANY KEY to Continue", ctx.canvas.width / 2, ctx.canvas.height / 2 + 25);
};

/**
 * REmove the event listener
 * @method exit
 */
GameOverState.prototype.exit = function () {
    document.removeEventListener("keyup", gameOverEventHandler, false);
};

/**
 * Represents a EndGameState.
 * @class EndGameState
 * @constructor
 * @param {object} actor -  the object that has the finite state machine instance
 */
function EndGameState(actor) {
    this.actor = actor;
}

/**
 * Add event listener
 * @method enter
 */
EndGameState.prototype.enter = function () {
    document.addEventListener("keyup", endGameEventHandler, false);
};

/**
 * call the render method of the end game state
 * @method update
 */
EndGameState.prototype.update = function (dt) {
    this.render();
};


/**
 * Render the game over screen
 * @method render
 */
EndGameState.prototype.render = function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    renderMap();
    renderEnemies();
    renderGems();
    renderTimeAndScore();
    player.render();
    key.render();
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 250, ctx.canvas.width, 100);
    ctx.globalAlpha = 1;
    ctx.font = "48px 'Gloria Hallelujah', cursive, Arial, serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("CONGRATS!!!!", ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.font = "18px 'Gloria Hallelujah', cursive, Arial, serif";
    ctx.fillText("Your Score: " + calculateScore(), ctx.canvas.width / 2, ctx.canvas.height / 2 + 25);
};

/**
 * Remove the event listener
 * @method exit
 */
EndGameState.prototype.exit = function () {
    document.removeEventListener("keyup", endGameEventHandler, false);
};

/* General Functions */

/** 
 * Function event handler for the menu state
 * @param {event} - event object
 */
var menuEventHandler = function (e) {
    frogger.handleInput(allowedKeys[e.keyCode]);
};

/** 
 * Function event handler for the playing state
 * @param {event} - event object
 */
var playingEventHandler = function (e) {
    player.handleInput(allowedKeys[e.keyCode]);
};

/** 
 * Function event handler for the game over state
 * @param {event} - event object
 */
var gameOverEventHandler = function (e) {
    frogger.reset();
};

/** 
 * Function event handler for the end game state
 * @param {event} - event object
 */
var endGameEventHandler = function (e) {
    frogger.reset();
};

/** 
 * Define the line equation between to points.
 * @params {object} p - and object that represent a point (p.x, p.y)on the canvas 
 * @params {object} q - and object that represent a point (q.x, q.y) on the canvas 
 * @return {function} the line equation
 */
function construcLineEquation(p, q) {
    return function (x) {
        return (((x - p.x) * (q.y - p.y)) / (q.x - p.x)) + p.y;
    };
}

/** 
 * Calculate the score by reducing the score array
 * @return {number} 
 */
function calculateScore() {
    var total = score.reduce(function (a, b) {
        return a + b;
    });
    return total.toFixed(2);
}

/** 
 * Create a two dimension matriz that represent the map of the current level
 * @param {array} levels - array of string that represent the map and different type of tile
 * @return {array} 
*/
function createMap(levels) {
    var mapMatriz = [];
    levels.forEach(function (row, i) {
        var mapRow = [];
        row.split("").forEach(function (tile, j) {
            switch (tile) {
            case "W":
                mapRow.push(new WaterTile(j, i, "images/water-block.png"));
                break;
            case "G":
                mapRow.push(new GrassTile(j, i, "images/grass-block.png"));
                break;
            case "S":
                mapRow.push(new StoneTile(j, i, "images/stone-block.png"));
                break;
            case "D":
                mapRow.push(new Door(j, i, "images/stone-block.png"));
                break;
            }
        });
        mapMatriz.push(mapRow);
    });
    return mapMatriz;
}

/** 
 * Start the current level and set the initial position of the different object
 */
function start() {
    map = createMap(gameData["level" + currentLevel].map);
    allEnemies = createEnemies(gameData["level" + currentLevel].enemies);
    gems = createGems(gameData["level" + currentLevel].gems);
    player = (player) ? player : new Player();
    player.init(gameData["level" + currentLevel].player_position);
    key = new Key(
        gameData["level" + currentLevel].key.x,
        gameData["level" + currentLevel].key.y,
        gameData["level" + currentLevel].key.value
    );
    frogger = (frogger) ? frogger : new Frogger();
}

/** 
 * Calute the distance between two point on the canvas
 * @param {object} p - an object that represent a point on the canvas (p.x, p.y)
 * @param {object} q - an object that represent a point on the canvas (q.x, q.y)
 */
function distanceTwoPoint(p, q) {
    return Math.sqrt(Math.pow((p.x - q.x), 2) + Math.pow((p.y - q.y), 2));
}

/** 
 * create the gem objects according to the level
 */
function createGems(data) {
    var gems = [];
    data.forEach(function (gem) {
        gems.push(new Gem(gem.x, gem.y, gem.sprite, gem.time, gem.value));
    });
    return gems;
}

/** 
 * create the enemie objects according to the level
 */
function createEnemies(data) {
    var allEnemies = [];
    data.forEach(function (enemy) {
        var aux = new Enemy(enemy.x, enemy.y, enemy.velocity);
        allEnemies.push(aux);
    });
    return allEnemies;
}

/** 
 * create the gems object according to the level
 * @param {number} x - the x coordinate of the point
 * @param {number} y - the y coordinate of the point
 * @return {object} - retunt an object of the form {"x": x, "y": y};
 */
function buildPoint(x, y) {
    return {
        "x": x,
        "y": y
    };
}

/** 
 * Convert a range in a range to another range 
 * @param {number} rangeStart - the minimum value of the range we want to convert from
 * @param {number} rangeEnd -  the maximu value of the range we want to convert from
 * @param {number} newRangeStart - the minimum value of the range we want to convert
 * @param {number} newRangeEnd - the maximum value of the range we want to convert
 * @param {number} value - the value we want to convert
 * $return {number} 
 */
function convertRange(rangeStart, rangeEnd, newRangeStart, newRangeEnd, value) {
    var scale = (newRangeEnd - newRangeStart) / (rangeEnd - rangeStart);
    return (value * scale) + newRangeStart;
}

/** . 
 * @param {object} object - the player object
 * @param {number} x - the x coordinate on tha canvas
 * @param {number} y - the y coordinate on tha canvas
 * @return {bool}
 */
function outOfbound(object, x, y) {
    var newBottomY = y + object.height;
    var newTopY = y;
    var newRightX = x + object.width;
    var newLeftX = x;
    var topLimit = 48;
    var bottomLimit = 548;
    var rightLimit = ctx.canvas.width;
    var leftLimit = 0;
    return newBottomY > bottomLimit ||
        newTopY < topLimit ||
        newLeftX < leftLimit ||
        newRightX > rightLimit;
}

/** 
 * interate over the enenies array to draw them on the canvas
*/
function renderEnemies() {
    allEnemies.forEach(function (enemy) {
        enemy.render();
    });
}

/** 
 * interate over the map array to draw it on the canvas
*/
function renderMap() {
    map.forEach(function (row) {
        row.forEach(function (tile) {
            tile.render();
        });
    });
}

/** 
 * interate over the gems array to draw them on the canvas
*/
function renderGems() {
    gems.forEach(function (gem) {
        gem.render();
    });
}

/** 
 * render the timer and the game score
*/
function renderTimeAndScore() {
    ctx.font = "18px 'Gloria Hallelujah', cursive, Arial, serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "black";
    ctx.fillText("Score: ", ctx.canvas.width / 2, 45);
    ctx.fillText(calculateScore() + "pts.", ctx.canvas.width / 2 + 85, 45);
    if (frogger.finiteStateMachine.currentState == frogger.states.PLAYING) {
        timer = timer + 1;
    }
    ctx.fillText("Level: " + currentLevel, ctx.canvas.width, 25);
    ctx.textAlign = "center";
    ctx.fillText("Time: " + parseInt(timer / 60), ctx.canvas.width / 2, 25);
}

start();