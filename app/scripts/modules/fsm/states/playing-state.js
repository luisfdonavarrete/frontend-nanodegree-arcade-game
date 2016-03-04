'use strict';
var Engine = require('../../../modules/engine');
var Constants = require('../../../utils/constants');

/* Represents a PlayingState.
 * @class PlayingState
 * @constructor
 * @param {object} actor - the object that has the finite state machine instance
 */
function PlayingState(actors) {
    this.actors = actors;
}

/**
 * The method gets called when the game enters the state, Add event listener
 * @method enter
 */
PlayingState.prototype.enter = function () {
  var self = this;
  document.addEventListener("keyup", function (e) {
    self.actors.player.handleInput.call(self.actors.player, Constants.ALLOWED_KEYS[e.keyCode]);
  }, false);
};

/**
 * update the playing state
 * @method update
 * @param {number} dt - time delta information
 */
PlayingState.prototype.tick = function () {
  Object.keys(this.actors).forEach(function (key) {
    Engine.subscribeEntity(this.actors[key]);
  }, this);
};

/**
 * Exit the playing state, remove event listener
 * @method exit
 */
PlayingState.prototype.exit = function () {
    document.removeEventListener("keyup", playingEventHandler, false);
};

module.exports = PlayingState;
