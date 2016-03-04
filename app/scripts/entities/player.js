'use strict';

var Sprite = require('./sprite');
var Life = require('./life');
var Resources = require('../modules/resources');
var Utils = require('../utils/utils');
/**
* Represents a Player.
* @class Player
* @constructor
*/
function Player(x, y) {
  Sprite.call(this, "images/char-boy.png", 0, 63, x, y, 101, 83);
  this.key = null;
  this.numOfLives = 5;
  this.lifes = [];
  for (var i = 0; i < this.numOfLives; i++) {
    this.lifes.push(new Life(25 * i, 25));
  }
}
Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;
/**
* Update the center point of the player
* @method update
*/
Player.prototype.update = function (dt) {
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
};
/**
* Render the player and the calls the render method on the lives objets.
* @method render
*/
Player.prototype.render = function (ctx) {
  ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
  ctx.globalAlpha = 1;
  this.lifes.forEach(function (live) {
    live.render(ctx);
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
  if (!Utils.outOfbound(this, newDrawX, newDrawY) /*&& this.checkCondicion(newDrawX, newDrawY)*/) {
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
    return this.key;
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
};
/**
* Event handler for the player input
* @method handleInput
*/
Player.prototype.handleInput = function (key) {
  console.log("AQUi");
  this.checkMovement(key);
};
/**
* Set the image character of the player
* @method setSprite
*/
Player.prototype.setSprite = function (sprite) {
  this.sprite = sprite;
}
module.exports = Player;
