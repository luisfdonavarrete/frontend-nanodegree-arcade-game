var frogger;
var player;
var map;
var allEnemies;
var currentLevel = 10;
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

function calculateScore() {
    var total = score.reduce(function (a, b) {
        return a + b;
    });
    return total.toFixed(2);
}

function FiniteStateMachine() {
    this.states = {};
    this.currentState = "";
    this.previousState = "";
}

// params: stateName:String, stateObject:object, StatesAllowed:Array
FiniteStateMachine.prototype.addState = function (stateName, stateObject, statesAllowed) {
    this.states[stateName] = {
        "stateName": stateName,
        "stateObject": stateObject,
        "statesAllowed": statesAllowed
    };
};

// params: stateName:String
FiniteStateMachine.prototype.setState = function (stateName) {
    if (this.currentState == false) {
        this.currentState = stateName;
        this.states[this.currentState].stateObject.enter();
        return;
    }
    if (this.currenState == stateName) {
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

FiniteStateMachine.prototype.update = function (dt) {
    this.states[this.currentState].stateObject.update(dt);
};

function TileMap(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.width = 101;
    this.height = 83;
    this.sprite = sprite;
}

TileMap.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x * this.width, this.y * this.height);
};

function WaterTile(x, y, sprite) {
    TileMap.call(this, x, y, sprite);
}

WaterTile.prototype = Object.create(TileMap.prototype);
WaterTile.prototype.constructor = WaterTile;

function StoneTile(x, y, sprite) {
    TileMap.call(this, x, y, sprite);
}

StoneTile.prototype = Object.create(TileMap.prototype);
StoneTile.prototype.constructor = StoneTile;

function GrassTile(x, y, sprite) {
    TileMap.call(this, x, y, sprite);
}

GrassTile.prototype = Object.create(TileMap.prototype);
GrassTile.prototype.constructor = GrassTile;

function Door(x, y, sprite) {
    TileMap.call(this, x, y, sprite);
    this.doorSprite = "images/door.png";
}

Door.prototype = Object.create(TileMap.prototype);
Door.prototype.constructor = Door;

Door.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x * this.width, this.y * this.height);
    ctx.drawImage(Resources.get(this.doorSprite), this.x * this.width, this.y * this.height - 19);
};

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

Gem.prototype.render = function () {
    if (this.time > 0) {
        ctx.globalAlpha = convertRange(0, this.liveTime, 0, 1, this.time);
        ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
        ctx.globalAlpha = 1;
    }
};

Gem.prototype.update = function (dt) {
    if (this.time > 0) {
        this.time = this.time - dt;
        this.value = this.value - dt;
    }
};

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

Key.prototype.init = function (x, y) {
    this.drawX = x;
    this.drawY = y;
    this.centerX = this.drawX + (this.width * 0.5);
    this.centerY = this.drawY + (this.height * 0.5);
};

Key.prototype.update = function (dt) {
    this.value = this.value - dt;
};

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

var Enemy = function (x, y, velocity) {
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
};

Enemy.prototype.update = function (dt) {
    this.drawX = (this.drawX > ctx.canvas.width) ? (-1 * this.width) : (this.drawX + (this.velocity * dt));
    this.centerX = this.drawX + (this.width * 0.5);
    this.centerY = this.drawY + (this.height * 0.5);
};

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

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

Player.prototype.update = function () {
    this.centerX = this.drawX + (this.width * 0.5);
    this.centerY = this.drawY + (this.height * 0.5);
};

Player.prototype.init = function (initialPosition) {
    this.drawX = initialPosition.x;
    this.drawY = initialPosition.y;
    this.centerX = this.drawX + (this.width * 0.5);
    this.centerY = this.drawY + (this.height * 0.5);
    this.key = false;
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    ctx.globalAlpha = 1;
    this.lives.forEach(function (live) {
        live.render();
    });
};

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

Player.prototype.getLives = function () {
    var total = this.lives.reduce(function (a, b) {
        return (b.state) ? a + 1 : a;
    }, 0);
    return total;
};

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

Player.prototype.checkCondicion = function (newDrawX, newDrawY) {
    var row = parseInt(newDrawY / this.height);
    var column = parseInt(newDrawX / this.width);
    if (gameData["level" + currentLevel].end_position.x === row && gameData["level" + currentLevel].end_position.y === column) {
        return this.key
    } else {
        return true;
    }
};

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

Player.prototype.checkLevel = function () {
    var p = buildPoint(parseInt(this.drawY / 83), parseInt(this.drawX / 83));
    var q = buildPoint(gameData["level" + currentLevel].end_position.x, gameData["level" + currentLevel].end_position.y);
    return p.x == q.x &&
        p.y == q.y;
}

Player.prototype.handleInput = function (e) {
    this.checkMovement(e);
};

Player.prototype.setSprite = function (sprite) {
    this.sprite = sprite;
}

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
    this.finiteStateMachine.addState(this.states.MENU, new MenuState(this), ["PLAYING"]);
    this.finiteStateMachine.addState(this.states.PLAYING, new PlayingState(this), ["MENU", "PAUSED", "LOSING", "TRANSITION_LEVEL"]);
    this.finiteStateMachine.addState(this.states.LOSING, new LosingState(this), ["PLAYING", "GAME_OVER"]);
    this.finiteStateMachine.addState(this.states.TRANSITION_LEVEL, new TransitionLevelState(this), ["PLAYING", "END"]);
    this.finiteStateMachine.addState(this.states.GAME_OVER, new GameOverState(this), ["PLAYING", "MENU"]);
    this.finiteStateMachine.addState(this.states.END, new EndGameState(this), ["MENU"]);

    this.finiteStateMachine.setState(this.states.MENU);
}

Frogger.prototype.update = function (dt) {
    this.finiteStateMachine.update(dt);
};

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

function MenuState(actor) {
    this.actor = actor;
}

MenuState.prototype.enter = function () {
    document.addEventListener("keyup", menuEventHandler, false);
};

MenuState.prototype.update = function (dt) {
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

MenuState.prototype.exit = function () {
    document.removeEventListener("keyup", menuEventHandler, false);
    player.setSprite(this.actor.characters[this.actor.selectedCharacter]);
};

function PlayingState(actor) {
    this.actor = actor;
}

PlayingState.prototype.enter = function () {
    document.addEventListener("keyup", playingEventHandler, false);
};

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

PlayingState.prototype.render = function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    renderTimeAndScore();
    renderMap();
    renderEnemies();
    renderGems();
    player.render();
    key.render();
};

PlayingState.prototype.exit = function () {
    document.removeEventListener("keyup", playingEventHandler, false);
};

function LosingState(actor) {
    this.actor = actor;
    this.path;
    this.startPonit;
    this.endPoint;
}

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

LosingState.prototype.exit = function () {
    player.drawX = this.endPoint.x;
    player.drawY = this.endPoint.y;
};

function TransitionLevelState(actor) {
    this.actor = actor;
    this.time;
}

TransitionLevelState.prototype.enter = function () {
    this.time = 0;
    if (currentLevel < Object.keys(gameData).length) {
        currentLevel = currentLevel + 1;
    } else {
        this.actor.finiteStateMachine.setState(this.actor.states.END);
    }
};

TransitionLevelState.prototype.update = function (dt) {
    this.time++;
    if (this.time >= 120) {
        this.actor.finiteStateMachine.setState(this.actor.states.PLAYING);
    }
    this.render();
};

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

TransitionLevelState.prototype.exit = function () {
    if (currentLevel < Object.keys(gameData).length) {
        start();
    }
};

function GameOverState(actor) {
    this.actor = actor;
}

GameOverState.prototype.enter = function () {
    document.addEventListener("keyup", gameOverEventHandler, false);
};

GameOverState.prototype.update = function (dt) {
    this.render();
};

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

GameOverState.prototype.exit = function () {
    document.removeEventListener("keyup", gameOverEventHandler, false);
};

function EndGameState(actor) {
    this.actor = actor;
}

EndGameState.prototype.enter = function () {
    document.addEventListener("keyup", endGameEventHandler , false);
};

EndGameState.prototype.update = function (dt) {
    this.render();
};

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

EndGameState.prototype.exit = function () {
    document.removeEventListener("keyup", endGameEventHandler , false);
};

/* Functions */
var menuEventHandler = function (e) {
    frogger.handleInput(allowedKeys[e.keyCode]);
};

var playingEventHandler = function (e) {
    player.handleInput(allowedKeys[e.keyCode]);
};

var gameOverEventHandler = function (e) {
    frogger.reset();
};

var endGameEventHandler = function(e){
    frogger.reset();
}

function construcLineEquation(p, q) {
    return function (x) {
        return (((x - p.x) * (q.y - p.y)) / (q.x - p.x)) + p.y;
    };
}

function checkCollisions(objectA, objectB) {
    return objectA.drawX <= objectB.drawX + objectB.width &&
        objectA.drawX >= objectB.drawX;
}

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

function distanceTwoPoint(p, q) {
    return Math.sqrt(Math.pow((p.x - q.x), 2) + Math.pow((p.y - q.y), 2));
}

function createGems(data) {
    var gems = [];
    data.forEach(function (gem) {
        gems.push(new Gem(gem.x, gem.y, gem.sprite, gem.time, gem.value));
    });
    return gems;
}

function createEnemies(data) {
    var allEnemies = [];
    data.forEach(function (enemy) {
        var aux = new Enemy(enemy.x, enemy.y, enemy.velocity);
        allEnemies.push(aux);
    });
    return allEnemies;
}

function buildPoint(x, y) {
    return {
        "x": x,
        "y": y
    };
}

function convertRange(rangeStart, rangeEnd, newRangeStart, newRangeEnd, value) {
    var scale = (newRangeEnd - newRangeStart) / (rangeEnd - rangeStart);
    return (value * scale) + newRangeStart;
}

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

function renderEnemies() {
    allEnemies.forEach(function (enemy) {
        enemy.render();
    });
}

function renderMap() {
    map.forEach(function (row) {
        row.forEach(function (tile) {
            tile.render();
        });
    });
}

function renderGems() {
    gems.forEach(function (gem) {
        gem.render();
    });
}

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