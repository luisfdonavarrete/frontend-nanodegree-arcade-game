'use strict';
var Sprite = require('./sprite.js');

/**
 * Represents a Door inherent from TileMap.
 * @class Door
 * @constructor
 * @param {number} x - the x coordinate where to place the image
 * @param {number} y - the y coordinate where to place the image
 * @param {string} sprite - the image url to be drawn
 */
function Door(x, y) {
  Sprite.call(this, "images/door.png", 0, 0, x, y, 100, 83);
}

Door.prototype = Object.create(Sprite.prototype);
Door.prototype.constructor = Door;

/**
 * Render the image using the x and y attributes.
 * @method render
 */
Door.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x * this.width, this.y * this.height);
    ctx.drawImage(Resources.get(this.doorSprite), this.x * this.width, this.y * this.height - 19);
};

module.exports = Door;
