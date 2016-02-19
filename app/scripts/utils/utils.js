'use strict';
var Constants = require('./constants');
var Utils = (function () {
  /**
  * Calute the distance between two point on the canvas
  * @param {object} p - an object that represent a point on the canvas (p.x, p.y)
  * @param {object} q - an object that represent a point on the canvas (q.x, q.y)
  */
  var _distanceTwoPoint = function (p, q) {
    return Math.sqrt(Math.pow((p.x - q.x), 2) + Math.pow((p.y - q.y), 2));
  };
  /**
  * create the gems object according to the level
  * @param {number} x - the x coordinate of the point
  * @param {number} y - the y coordinate of the point
  * @return {object} - retunt an object of the form {"x": x, "y": y};
  */
  var _buildPoint = function (x, y) {
    return {
      "x": x,
      "y": y
    };
  };
  /**
  * Convert a range in a range to another range
  * @param {number} rangeStart - the minimum value of the range we want to convert from
  * @param {number} rangeEnd -  the maximu value of the range we want to convert from
  * @param {number} newRangeStart - the minimum value of the range we want to convert
  * @param {number} newRangeEnd - the maximum value of the range we want to convert
  * @param {number} value - the value we want to convert
  * $return {number}
  */
  var _convertRange = function (rangeStart, rangeEnd, newRangeStart, newRangeEnd, value) {
    var scale = (newRangeEnd - newRangeStart) / (rangeEnd - rangeStart);
    return (value * scale) + newRangeStart;
  };

  /** .
  * @param {object} object - the player object
  * @param {number} x - the x coordinate on tha canvas
  * @param {number} y - the y coordinate on tha canvas
  * @return {bool}
  */
  var _outOfbound = function (object, x, y) {
    var newBottomY = y + object.height;
    var newTopY = y;
    var newRightX = x + object.width;
    var newLeftX = x;
    var topLimit = 48;
    var bottomLimit = 548;
    var rightLimit = Constants.CANVAS_WIDTH;
    var leftLimit = 0;
    return newBottomY > bottomLimit ||
    newTopY < topLimit ||
    newLeftX < leftLimit ||
    newRightX > rightLimit;
  };

  return {
    distanceTwoPoint: _distanceTwoPoint,
    buildPoint: _buildPoint,
    convertRange: _convertRange,
    outOfbound: _outOfbound
  };
})();
module.exports = Utils;
