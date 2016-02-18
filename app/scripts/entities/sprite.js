'use strict';

/**
 * Represents a sprite. All objects are going to inherent from it.
 * @class Sprite
 * @constructor
 */
function Sprite(sprite, srcX, srcY, drawX, drawY, width, height) {
    this.sprite = sprite;
    this.srcX = srcX;
    this.srcY = srcY;
    this.drawX = drawX;
    this.drawY = drawY;
    this.width = width;
    this.height = height;
    this.centerX = this.drawX + (this.width * 0.5);
    this.centerY = this.drawY + (this.height * 0.5);
}
module.exports = Sprite;
