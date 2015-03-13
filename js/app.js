(function () {

    var player = new Player();
    var map;
    var allEnemies;
    var status = false;
    var currentLevel = 1;
    var gameData;
    var key;
    var gems;
    var score = 0;


    function FiniteStateMachine() {
        this.stages = {};
        this.currentState = "";
        this.previousState = "";
    }

    // params: stateName:String, stateObject:object, StatesAllowed:Array
    FiniteStateMachine.prototype.addState = function (stateName, stateObject, statesAllowed) {
        this.stages[stateName] = {
            "stateName": stateName,
            "stateObject": stateObject,
            "statesAllowed": statesAllowed
        }
    };

    // params: stateName:String
    FiniteStateMachine.prototype.setState = function (stateName) {
        if (this.currentState == false) {
            this.currentState = stateName;
            this.stages[this.currentState].stateObject.enter();
            return;
        }
        if (this.currenState == stateName) {
            console.log("the actor is already in this state");
            return;
        }
        if (this.stages[this.currentState].statesAllowed.indexOf(stateName) > -1) {
            this.stages[this.currentState].stateObject.exit();
            this.previousState = this.currentState;
            this.currentState = stateName;
        } else {
            console.log("you are not allowed to switch to that " + stateName + "state being in " + this.currentState + "state");
        }
        this.stages[this.currentState].stateObject.enter();
    };

    FiniteStateMachine.prototype.update = function () {
        console.log("Current State: " + this.currentState);
        this.stages[this.currentState].stateObject.update();
    }


    function TileMap(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.width = 101;
        this.height = 83;
        this.sprite = sprite;
    };

    TileMap.prototype.render = function () {
        ctx.drawImage(Resources.get(this.sprite), this.x * this.width, this.y * this.height);
    }

    function WaterTile(x, y, sprite) {
        TileMap.call(this, x, y, sprite)
    }

    WaterTile.prototype = Object.create(TileMap.prototype);
    WaterTile.prototype.constructor = WaterTile;

    function StoneTile(x, y, sprite) {
        TileMap.call(this, x, y, sprite)
    }

    StoneTile.prototype = Object.create(TileMap.prototype);
    StoneTile.prototype.constructor = StoneTile;

    function GrassTile(x, y, sprite) {
        TileMap.call(this, x, y, sprite)
    }

    GrassTile.prototype = Object.create(TileMap.prototype);
    GrassTile.prototype.constructor = GrassTile;

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
    }

    Gem.prototype.render = function () {
        ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    };


    function Key(x, y) {
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
        this.sprite = "images/Key.png";
    };

    Key.prototype.init = function (x, y) {
        this.drawX = x;
        this.drawY = y;
        this.centerX = this.drawX + (this.width * 0.5);
        this.centerY = this.drawY + (this.height * 0.5);
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

    function MapRender() {
        map.forEach(function (row) {
            row.forEach(function (tile) {
                tile.render();
            });
        });
    }

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
    }

    Enemy.prototype.init = function (x, y, velocity) {}

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
            this.lives.push(new Live(35 * i, 15));
        }
    };

    Player.prototype.update = function () {
        this.centerX = this.drawX + (this.width * 0.5);
        this.centerY = this.drawY + (this.height * 0.5);
        this.checkKey();
        this.checkGems();
        this.checkCollisionEnemies();
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
        if (!outOfbound(this, newDrawX, newDrawY) && this.checkMap(newDrawX, newDrawY)) {
            this.drawX = newDrawX;
            this.drawY = newDrawY;
        }
    };

    Player.prototype.checkKey = function () {
        var p = biludPoint(this.centerX, this.centerY);
        var q = biludPoint(key.centerX, key.centerY);
        if (distanceTwoPoint(p, q) < (this.width * 0.5)) {
            player.key = true;
        }
    };

    Player.prototype.checkCollisionEnemies = function () {
        var self = this;
        allEnemies.forEach(function (enemy) {
            var p = biludPoint(enemy.centerX, enemy.centerY);
            var q = biludPoint(self.centerX, self.centerY);
            if (parseInt(p.y / 83) === parseInt(q.y / 83) && distanceTwoPoint(p, q) < (self.width * 0.75)) {
                if (self.numOfLives > 0) {
                    self.lives[self.numOfLives - 1].state = false;
                    self.numOfLives--;
                    resetGame();
                } else {
                    console.log("Game OVer");
                }
            }
        });
    };

    Player.prototype.checkGems = function () {
        var self = this;
        gems.forEach(function (gem, i) {
            var p = biludPoint(gem.centerX, gem.centerY);
            var q = biludPoint(self.centerX, self.centerY);
            if (parseInt(p.y / 83) === parseInt(q.y / 83) && distanceTwoPoint(p, q) < (self.width * 0.75)) {
                score += gem.value;
                gems.splice(i, 1);
                return;
            }
        });
    }

    Player.prototype.checkMap = function (newDrawX, newDrawY) {
        var row = parseInt(newDrawY / this.height);
        var column = parseInt(newDrawX / this.width);
        var mapRow = map[row];
        var mapColumn = mapRow[column];
        if (mapColumn instanceof WaterTile) {
            resetGame();
            return false;
        } else if (gameData["level" + currentLevel].end_position.x === row && gameData["level" + currentLevel].end_position.y === column) {
            return this.key
        }
        return true;
    };

    Player.prototype.handleInput = function (e) {
        this.checkMovement(e);
    };

    function Live(x, y) {
        this.sprite = "images/heart.png";;
        this.srcX = 0;
        this.srcY = 45;
        this.drawX = x;
        this.drawY = y;
        this.width = 101;
        this.height = 100;
        this.scaleWidth = 35;
        this.scaleHeight = this.scaleWidth / (this.width / this.height);
        this.state = true;
    }

    Live.prototype.render = function () {
        ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.scaleWidth, this.scaleHeight);
        if (!this.state) {
            ctx.beginPath();
            ctx.moveTo(this.drawX + this.scaleWidth, this.drawY);
            ctx.lineTo(this.drawX, this.drawY + this.scaleHeight);
            ctx.stroke();
        }
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

    function createMap(levels) {
        var mapMatriz = [];
        levels.forEach(function (row, i) {
            var mapRow = [];
            row.split("").forEach(function (tile, j) {
                switch (tile) {
                case "W":
                    mapRow.push(new WaterTile(j, i, "images/water-block.png"));
                    break;
                case "S":
                    mapRow.push(new StoneTile(j, i, "images/stone-block.png"));
                    break;
                case "G":
                    mapRow.push(new GrassTile(j, i, "images/grass-block.png"));
                    break;
                }
            });
            mapMatriz.push(mapRow);
        });
        return mapMatriz;
    }


    function update(dt) {
        frogger.update();
        /*allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        player.update();*/
    }

    function render() {
        /*ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = "20px 'Gloria Hallelujah', cursive, Arial, serif";
        ctx.textAlign = "end";
        ctx.fillText("Score: ", ctx.canvas.width - 101, 42);
        ctx.fillText(score + "pts.", ctx.canvas.width, 42);
        MapRender();
        gems.forEach(function (gem) {
            gem.render();
        });
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });
        player.render();
        key.render();*/
    }


    function biludPoint(x, y) {
        return {
            "x": x,
            "y": y
        };
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

    function resetGame() {
        player.init(gameData["level" + currentLevel].player_position);
        key.init(
            gameData["level" + currentLevel].key.x,
            gameData["level" + currentLevel].key.y
        );
    }
    
    function Frogger(){
        this.velocity = 0;
        this.finiteStateMachine = new FiniteStateMachine();
        this.states = {
            "MENU": "MENU",
            "PLAYING": "PLAYING",
            "PAUSED": "PAUSED",
            "LOSING": "LOSING",
            "END": "END"
        };
        this.finiteStateMachine.addState(this.states.MENU, new MenuStage(this), ["END", "MENU", "PLAYING"]);
        this.finiteStateMachine.setState(this.states.MENU);
    }
    
    Frogger.prototype.update = function(dt){
        this.finiteStateMachine.update();
    };
    
    Frogger.prototype.render = function(){
        
    };
    
    function MenuStage (actor){
        this.actor = actor;
    }
    
    MenuStage.prototype.enter = function(){
    };
    
    MenuStage.prototype.update = function(){
        
    };

    MenuStage.prototype.exit = function(){
    };
    
    var frogger = new Frogger();
    
    function start(data) {
        gameData = data;

        document.addEventListener("keyup", function (e) {
            var allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };
            player.handleInput(allowedKeys[e.keyCode]);
        });
        map = createMap(data["level" + currentLevel].map);
        allEnemies = createEnemies(data["level" + currentLevel].enemies);
        gems = createGems(data["level" + currentLevel].gems);
        player.init(data["level" + currentLevel].player_position);
        key = new Key(
            gameData["level" + currentLevel].key.x,
            gameData["level" + currentLevel].key.y
        );
        Resources.load([
            'images/stone-block.png',
            'images/water-block.png',
            'images/grass-block.png',
            'images/enemy-bug.png',
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png',
            'images/Key.png',
            'images/gem-blue.png',
            'images/heart.png'
        ]);
        Resources.onReady(function () {
            init(update, render);
        });
    }

    function distanceTwoPoint(p, q) {
        return Math.sqrt(Math.pow((p.x - q.x), 2) + Math.pow((p.y - q.y), 2));
    }

    $.get('data/game_data.json', start);
})();