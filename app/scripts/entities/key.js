'use strict';
var sprite = require('./sprite');
/**
 * Represents a Key.
 * @class Key
 * @constructor
 * @param {number} x - the x coordinate where to place the image
 * @param {number} y - the y coordinate where to place the image
 * @param {number} value - points
 */
function Key (x, y, value) {
  Sprite.call(this, "images/key.png", 20, 52, x, y, 60, 100);
  this.widthScale = 30;
  this.heightScale = this.widthScale / (this.width / this.height);
  this.value = value;
}
Key.prototype = Object.create(Sprite.prototype);
Key.prototype.constructor = Key;
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
module.exports = Key;
