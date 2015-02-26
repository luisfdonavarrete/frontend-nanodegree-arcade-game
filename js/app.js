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
    if (this.x > 707) {
        this.init();
    }
    this.x = this.x + this.velocity * dt;
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
    this.checkCollisions();
};

Player.prototype.init = function(){
    this.x = 101 * 2;
    this.y = 380;
};

Player.prototype.checkCollisions = function () {

    function calculateDistance(p, q) {
        return Math.sqrt(Math.pow((p.x - q.x), 2) + Math.pow((p.y - q.y), 2));
    }
    var self = this;
    allEnemies.forEach(function (enemy) {
        var p = {
            x: self.x,
            y: self.y
        };
        var q = {
            x: enemy.x,
            y: enemy.y
        };
        var dist = calculateDistance(p, q);
        if (dist < self.radius) {
            self.init();
        }
    });
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    var self = this;
};

Player.prototype.handleInput = function (movement) {
    ctx.clearRect(this.x, this.y, 101, 171);
    switch (movement) {
    case "left":
        (this.x > 0) && (this.x -= 101);
        break;
    case "right":
        (this.x < 404) && (this.x += 101);
        break;
    case "up":
        (this.y > -35) && (this.y -= 83);
        break;
    case "down":
        (this.y < 380) && (this.y += 83);
        break;
    }
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

var player = new Player();
player.init();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});