'use strict';
var Sprite = require('./sprite');

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
  Sprite.call(this, sprite, 0, 50, x, y, 101, 121);
  this.time = time;
  this.value = value;
  this.liveTime = time;
}
Gem.prototype = Object.create(Sprite.prototype);
Gem.prototype.constructor = Gem;
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

module.xports = Gem;
