'use strict';
var Sprite = require('./sprite');

/**
 * Represents a Enemy.
 * @class Enemy
 * @constructor
 * @param {number} x - the x coordinate where to place the image
 * @param {number} y - the y coordinate where to place the image
 * @param {number} velocity - the velocity of the enemy
 */
function Enemy(x, y, velocity) {
  Sprite.call(this, "images/enemy-bug.png", 0, 70, x, y, 101, 83);
  this.velocity = velocity;
}
Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;
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

module.exports = Enemy;
