// Enemies our player must avoid
var Enemy = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = 0;
    this.y = 0;
    this.velocity = 0;
    this.centerX = 50;
    this.centerY = 100;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

Enemy.prototype.init = function () {
    var positions = [227, 144, 61];
    this.x = -101;
    this.y = positions[Math.floor(Math.random() * 3)];
    this.velocity = Math.random() * 5 + 100;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (game.state) {
        if (this.x > 707) {
            this.init();
        }
        this.x = this.x + this.velocity * dt;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
    this.sprite = "images/char-boy.png";
    this.x = 0;
    this.y = 0;
    this.centerX = 50;
    this.centerY = 125;
    this.radius = 70;
};

Player.prototype.update = function () {
    var self = this;

    function calculateDistance(p, q) {
        return Math.sqrt(Math.pow((p.x - q.x), 2) + Math.pow((p.y - q.y), 2));
    }

    function checkCollisions() {
        allEnemies.forEach(function (enemy) {
            var p = {
                x: self.x,
                y: self.y
            };
            var q = {
                x: enemy.x,
                y: enemy.y
            };
            if (calculateDistance(p, q) < self.radius) {
                self.init();
            }
        });
    }
    checkCollisions();
};

Player.prototype.init = function () {

    this.x = 101 * 2;
    this.y = 380;
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    var eventHandler = {
        "left": function (player) {
            (this.x > 0) && (this.x -= 101);
        },
        "right": function (player) {
            (this.x < 404) && (this.x += 101);
        },
        "up": function (player) {
            (this.y > -35) && (this.y -= 83);
        },
        "down": function (player) {
            (this.y < 380) && (this.y += 83);
        }
    };
    var aux = eventHandler[allowedKeys[e.keyCode]];
    (typeof aux == "function") && aux.call(this);
};

var Game = function (player, enemies) {
    this.player = player;
    this.enemies = enemies;
    this.state = false;
    this.offset = 217;
    this.characters = [
        "images/char-boy.png",
        "images/char-cat-girl.png",
        "images/char-horn-girl.png",
        "images/char-pink-girl.png",
        "images/char-princess-girl.png"
    ];
    this.selectedCharacter = 0;
    this.player.init();
};

Game.prototype.update = function (dt) {
    this.enemies.forEach(function (enemy) {
        enemy.update(dt);
    });
    this.player.update();
};

Game.prototype.handleInput = function (e) {
    if(!this.state){
        var allowedKeys = {
            37: "left",
            39: "right",
            13: "enter"
        };
        var eventHandler = {
            "left": function () {
                (this.selectedCharacter > 0) && (this.selectedCharacter -= 1);
                this.player.sprite = this.characters[this.selectedCharacter];
            },
            "right": function () {
                (this.selectedCharacter < this.characters.length - 1) && (this.selectedCharacter += 1);
                this.player.sprite = this.characters[this.selectedCharacter];
            },
            "enter": function (player) {
                this.state = true;
            }
        };
        var aux = eventHandler[allowedKeys[e.keyCode]];
        (typeof aux == "function") && aux.call(this);
    }
    else {
        this.player.handleInput(e);
    }
};

Game.prototype.render = function () {
    self = this;
    if (!this.state) {
        // Draw the background
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
        this.characters.forEach(function (character, row) {
            if (self.selectedCharacter == row) {
                ctx.drawImage(Resources.get("images/Selector.png"), row * 101, self.offset);
            }
            ctx.drawImage(Resources.get(character), row * 101, self.offset);
        });
    } else {
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });
    }
    this.player.render();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];

for (var i = 0; i < 3; i++) {
    var aux = new Enemy();
    aux.init();
    allEnemies.push(aux);
}

var game = new Game(new Player(), allEnemies);
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

document.addEventListener('keyup', function (e) {
    game.handleInput(e);
});