'use strict';
var Sprite = require('./sprite');
var Resources = require('../modules/resources');
/**
  * Represents a TileMap.
  * @class TileMap
  * @constructor
  * @param {number} x - the x coordinate where to place the image
  * @param {number} y - the y coordinate where to place the image
  * @param {string} sprite - the image url to be drawn
  */
function TileMap(x, y, sprite) {
  Sprite.call(this, sprite, 0, 0, x, y, 101, 83);
  this.type = sprite; /* It is going to be base on the sprite fie name (grass, stone, water)*/
}
TileMap.prototype = Object.create(Sprite.prototype);
TileMap.prototype.constructor = TileMap;
 /**
  * Render the image using the x and y attributes.
  * @method render
  */
TileMap.prototype.render = function (ctx) {
  ctx.drawImage(Resources.get(this.sprite), this.x * this.width, this.y * this.height);
};
module.exports = TileMap;
