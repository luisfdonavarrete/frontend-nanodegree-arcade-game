'use strict';

var Sprite = require('./sprite.js');
var Resources = require('../modules/resources');
/**
 * Represents a Live.
 * @class Live
 * @constructor
 */
function Life(x, y) {
  Sprite.call(this, "images/heart.png", 0, 45, x, y, 101, 100);
  this.scaleWidth = 25;
  this.scaleHeight = this.scaleWidth / (this.width / this.height);
  this.state = true;
}

Life.prototype = Object.create(Sprite.prototype);
Life.prototype.constructor = Life;
/**
 * Render the image
 * @method setSprite
 */
Life.prototype.render = function (ctx) {
    ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.scaleWidth, this.scaleHeight);
    if (!this.state) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(this.drawX + this.scaleWidth, this.drawY);
        ctx.lineTo(this.drawX + 4, this.drawY + this.scaleHeight - 4);
        ctx.stroke();
    }
};
module.exports = Life;
