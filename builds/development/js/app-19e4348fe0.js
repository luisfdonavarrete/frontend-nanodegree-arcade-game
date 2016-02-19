(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Player = require('./entities/player');
var Engine = require('./modules/engine');
var Enemy = require('./entities/enemy');

var player = new Player();
Engine.subscribeEntity(player);
var allEnemies = [];

function createEnemies() {
  [
    {"x": 0, "y": 133, "velocity": 80},
    {"x": 0, "y": 216, "velocity": 55},
    {"x": 0, "y": 299, "velocity": 20}
  ].forEach(function (enemy) {
    var aux = new Enemy(enemy.x, enemy.y, enemy.velocity);
    allEnemies.push(aux);
  });
}
createEnemies();
Engine.subscribeEntity(allEnemies);

//
//
//
// var frogger;
// var player;
// var map;
// var allEnemies;
// var currentLevel = 1;
// var key;
// var gems;
// var score = [];
// for (var i = 0, stopCondition = Object.keys(gameData).length; i < stopCondition; i++) {
//     score[i] = 0;
// }
// var CANVAS_WITH = 505;
// var CANVAS_HEIGHT = 606;
// var allowedKeys = {
//     37: 'left',
//     38: 'up',
//     39: 'right',
//     40: 'down',
//     13: 'enter'
// };
//
// var timer = 0;
//
// /**
//  * Represents a Finite State Machine.
//  * @class FiniteStateMachine
//  * @constructor
//  */
// function FiniteStateMachine() {
//     this.states = {};
//     this.currentState = "";
//     this.previousState = "";
// }
//
// /**
//  * Add a new state to the states variable.
//  * @method addState
//  * @param {string} stateName - The name of the state.
//  * @param {object} stateObject - The instance of the state object.
//  * @param {array} statesAllowed - Array of state names that are allowed to switch.
//  */
// FiniteStateMachine.prototype.addState = function (stateName, stateObject, statesAllowed) {
//     this.states[stateName] = {
//         "stateName": stateName,
//         "stateObject": stateObject,
//         "statesAllowed": statesAllowed
//     };
// };
//
// /**
//  * Set the current state
//  * @method setState
//  * @param {string} stateName - The name of the state to be set.
//  */
// FiniteStateMachine.prototype.setState = function (stateName) {
//     if (this.currentState === "") {
//         this.currentState = stateName;
//         this.states[this.currentState].stateObject.enter();
//         return;
//     }
//     if (this.currenState === stateName) {
//         console.log("the actor is already in this state");
//         return;
//     }
//     if (this.states[this.currentState].statesAllowed.indexOf(stateName) > -1) {
//         this.states[this.currentState].stateObject.exit();
//         this.previousState = this.currentState;
//         this.currentState = stateName;
//     } else {
//         console.log("you are not allowed to switch to that " + stateName + "state being in " + this.currentState + "state");
//     }
//     this.states[this.currentState].stateObject.enter();
// };
//
// /**
//  * Calls the update method of the current state.
//  * @method update
//  * @param {number} dt - time delta information.
//  */
// FiniteStateMachine.prototype.update = function (dt) {
//     this.states[this.currentState].stateObject.update(dt);
// };

//

//
//
//
// /**
//  * Represents the Frogger Game.
//  * @class Frogger
//  * @constructor
//  */
// function Frogger() {
//     this.velocity = 150;
//     this.finiteStateMachine = new FiniteStateMachine();
//     this.characters = [
//             "images/char-boy.png",
//             "images/char-cat-girl.png",
//             "images/char-horn-girl.png",
//             "images/char-pink-girl.png",
//             "images/char-princess-girl.png"
//         ];
//     /** Define the different states that the game ca be in*/
//     this.states = {
//         "MENU": "MENU",
//         "PLAYING": "PLAYING",
//         "PAUSED": "PAUSED",
//         "LOSING": "LOSING",
//         "TRANSITION_LEVEL": "TRANSITION_LEVEL",
//         "GAME_OVER": "GAME_OVER",
//         "END": "END"
//     };
//     this.selectedCharacter = 0;
//     this.offset = CANVAS_HEIGHT / 2 - 171 / 2;
//     /** Add the state to the finite state machine instane */
//     this.finiteStateMachine.addState(this.states.MENU, new MenuState(this), ["PLAYING"]);
//     this.finiteStateMachine.addState(this.states.PLAYING, new PlayingState(this), ["MENU", "PAUSED", "LOSING", "TRANSITION_LEVEL"]);
//     this.finiteStateMachine.addState(this.states.LOSING, new LosingState(this), ["PLAYING", "GAME_OVER"]);
//     this.finiteStateMachine.addState(this.states.TRANSITION_LEVEL, new TransitionLevelState(this), ["PLAYING", "END"]);
//     this.finiteStateMachine.addState(this.states.GAME_OVER, new GameOverState(this), ["PLAYING", "MENU"]);
//     this.finiteStateMachine.addState(this.states.END, new EndGameState(this), ["MENU"]);
//     /** Set the initial sate to MENU */
//     this.finiteStateMachine.setState(this.states.MENU);
// }
//
// /**
//  * Calls the update method on the finite state machine
//  * @method update
//  * @param {number} dt - time delta informaction
//  */
// Frogger.prototype.update = function (dt) {
//     this.finiteStateMachine.update(dt);
// };
//
// /**
//  * Event handler for the player input
//  * @method handleInput
//  * @param {string} key - string thta indicate the pressed key
//  */
// Frogger.prototype.handleInput = function (key) {
//     switch (key) {
//     case "left":
//         this.selectedCharacter = (this.selectedCharacter > 0) ? this.selectedCharacter - 1 : this.selectedCharacter;
//         break;
//     case "right":
//         this.selectedCharacter = (this.selectedCharacter < this.characters.length - 1) ? this.selectedCharacter + 1 : this.selectedCharacter;
//         break;
//     case "enter":
//         this.finiteStateMachine.setState(this.states.PLAYING);
//         break;
//     default:
//         break;
//     }
// };
//
// /**
//  * Reset the game, the level, the score, lives, timer.
//  * @method reset
//  */
// Frogger.prototype.reset = function () {
//     timer = 0;
//     currentLevel = 1;
//     player.numOfLives = 5;
//     for (var i = 0, condition = score.length; i < condition; i++) {
//         score[i] = 0;
//     }
//     player.lives.forEach(function (live) {
//         live.state = true;
//     });
//     start();
//     this.finiteStateMachine.setState(this.states.MENU);
// }
//
// /**
//  * Represents a MenuState.
//  * @class MenuState
//  * @constructor
//  * @param {object} actor - the object that has the instance of the finite state machine
//  */
// function MenuState(actor) {
//     this.actor = actor;
// }
//
// /**
//  * The method gets called when the game enters the state, Add event listener
//  * @method enter
//  */
// MenuState.prototype.enter = function () {
//     document.addEventListener("keyup", menuEventHandler, false);
// };
//
// /**
//  * The method called for the finite state machine
//  * @method update
//  * @param {number} dt - time delta information
//  */
// MenuState.prototype.update = function (dt) {
//     this.render();
// };
//
// /**
//  * Render the select character screen
//  * @method update
//  */
// MenuState.prototype.render = function () {
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     renderMap();
//     ctx.fillStyle = "black";
//     ctx.globalAlpha = 0.5; // Half opacity
//     ctx.fillRect(0, 50, ctx.canvas.width, ctx.canvas.height - 70);
//     ctx.globalAlpha = 1;
//     // Draw the title
//     ctx.font = "42px 'Gloria Hallelujah', cursive, Arial, serif";
//     ctx.textAlign = "center";
//     ctx.fillStyle = "white";
//     ctx.fillText("Choose Your Character", ctx.canvas.width / 2, 140);
//     // draw selector image
//     var self = this.actor;
//     this.actor.characters.forEach(function (character, row) {
//         if (self.selectedCharacter == row) {
//             ctx.drawImage(Resources.get("images/Selector.png"), row * 101, self.offset);
//         }
//         ctx.drawImage(Resources.get(character), row * 101, self.offset);
//     });
// };
//
// /**
//  * the method gets called before leaving the state, remove the event listener
//  * @method exit
//  */
// MenuState.prototype.exit = function () {
//     document.removeEventListener("keyup", menuEventHandler, false);
//     player.setSprite(this.actor.characters[this.actor.selectedCharacter]);
// };
//
// /**
//  * Represents a PlayingState.
//  * @class PlayingState
//  * @constructor
//  * @param {object} actor - the object that has the finite state machine instance
//  */
// function PlayingState(actor) {
//     this.actor = actor;
// }
//
// /**
//  * The method gets called when the game enters the state, Add event listener
//  * @method enter
//  */
// PlayingState.prototype.enter = function () {
//     document.addEventListener("keyup", playingEventHandler, false);
// };
//
// /**
//  * update the playing state
//  * @method update
//  * @param {number} dt - time delta information
//  */
// PlayingState.prototype.update = function (dt) {
//     allEnemies.forEach(function (enemy) {
//         enemy.update(dt);
//     });
//     gems.forEach(function (gem) {
//         gem.update(dt);
//     });
//     key.update(dt);
//     player.update();
//     player.checkKey();
//     player.checkGems();
//     if (player.checkCollisionEnemies() || player.checkMap()) {
//         this.actor.finiteStateMachine.setState(this.actor.states.LOSING);
//     }
//     if (player.checkLevel()) {
//         this.actor.finiteStateMachine.setState(this.actor.states.TRANSITION_LEVEL);
//     }
//     if (player.getLives() <= 0) {
//         this.actor.finiteStateMachine.setState(this.actor.states.GAME_OVER);
//     }
//     this.render();
// };
//
//
// /**
//  * Render the playing state
//  * @method render
//  */
// PlayingState.prototype.render = function () {
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     renderTimeAndScore();
//     renderMap();
//     renderEnemies();
//     renderGems();
//     player.render();
//     key.render();
// };
//
// /**
//  * Exit the playing state, remove event listener
//  * @method exit
//  */
// PlayingState.prototype.exit = function () {
//     document.removeEventListener("keyup", playingEventHandler, false);
// };
//
// /**
//  * Represents a LosingState.
//  * @class LosingState
//  * @constructor
//  * @param {object} actor -  the object that has the finite state machine instance
//  */
// function LosingState(actor) {
//     this.actor = actor;
//     this.path;
//     this.startPonit;
//     this.endPoint;
// }
//
// /**
//  * The method gets called when the game enters the state,
//  * set the last player position
//  * set the initial position according to the level
//  * set the path to move the player
//  * reset the level: score, key, gems
//  * @method enter
//  */
// LosingState.prototype.enter = function () {
//     this.startPonit = buildPoint(player.drawX, player.drawY);
//     this.endPoint = buildPoint(gameData["level" + currentLevel].player_position.x, gameData["level" + currentLevel].player_position.y);
//     this.path = construcLineEquation(this.startPonit, this.endPoint);
//     player.key = false;
//     key.init(
//         gameData["level" + currentLevel].key.x,
//         gameData["level" + currentLevel].key.y,
//         gameData["level" + currentLevel].key.value
//     );
//     gems = createGems(gameData["level" + currentLevel].gems);
//     score[currentLevel - 1] = 0;
// };
//
// /**
//  * Move the player from the position where he lost to the initial position
//  * @method update
//  */
// LosingState.prototype.update = function (dt) {
//     if (this.startPonit.x == this.endPoint.x) {
//         player.drawY = player.drawY + this.actor.velocity * dt;
//         if (player.drawY >= this.endPoint.y) {
//             this.actor.finiteStateMachine.setState(this.actor.states.PLAYING);
//         }
//     } else if (this.startPonit.y == this.endPoint.y) {
//         player.drawX = (this.startPonit.x > this.endPoint.x) ? player.drawX - this.actor.velocity * dt : player.drawX + this.actor.velocity * dt;
//         if (this.startPonit.x > this.endPoint.x && player.drawX <= this.endPoint.x) {
//             this.actor.finiteStateMachine.setState(this.actor.states.PLAYING);
//         } else if (this.startPonit.x < this.endPoint.x && player.drawX >= this.endPoint.x) {
//             this.actor.finiteStateMachine.setState(this.actor.states.PLAYING);
//         }
//     } else {
//         player.drawX = (this.startPonit.x > this.endPoint.x) ? player.drawX - this.actor.velocity * dt : player.drawX + this.actor.velocity * dt;
//         player.drawY = this.path(player.drawX);
//         if (this.startPonit.x > this.endPoint.x && player.drawX <= this.endPoint.x) {
//             this.actor.finiteStateMachine.setState(this.actor.states.PLAYING);
//         } else if (this.startPonit.x < this.endPoint.x && player.drawX >= this.endPoint.x) {
//             this.actor.finiteStateMachine.setState(this.actor.states.PLAYING);
//         }
//     }
//     this.render();
// };
//
// /**
//  * Render the game scenario: map, enemies, gems, player, key, timer and score.
//  * @method render
//  */
// LosingState.prototype.render = function () {
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     renderTimeAndScore();
//     renderMap();
//     renderEnemies();
//     renderGems();
//     ctx.globalAlpha = 0.7;
//     player.render();
//     ctx.globalAlpha = 1;
//     key.render();
// }
//
//
// /**
//  *
//  * @method exit
//  */
// LosingState.prototype.exit = function () {
//     player.drawX = this.endPoint.x;
//     player.drawY = this.endPoint.y;
// };
//
// /**
//  * Represents a TransitionLevelState.
//  * @class TransitionLevelState
//  * @constructor
//  * @param {object} actor -  the object that has the finite state machine instance
//  */
// function TransitionLevelState(actor) {
//     this.actor = actor;
//     this.time;
// }
//
// /**
//  * The method gets called when the game enters the state,
//  * increase the level if is not the laste level.
//  * @method enter
//  */
// TransitionLevelState.prototype.enter = function () {
//     this.time = 0;
//     if (currentLevel < Object.keys(gameData).length) {
//         currentLevel = currentLevel + 1;
//     } else {
//         this.actor.finiteStateMachine.setState(this.actor.states.END);
//     }
// };
//
// /**
//  * The method called by the finite state machine, wait 2 second before to start the next level
//  * @method update
//  */
// TransitionLevelState.prototype.update = function (dt) {
//     this.time++;
//     if (this.time >= 120) {
//         this.actor.finiteStateMachine.setState(this.actor.states.PLAYING);
//     }
//     this.render();
// };
//
// /**
//  * Render the transition level state.
//  * @method render
//  */
// TransitionLevelState.prototype.render = function () {
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     renderMap();
//     renderEnemies();
//     renderGems();
//     player.render();
//     key.render();
//     renderTimeAndScore();
//     ctx.globalAlpha = 0.5;
//     ctx.fillStyle = "black";
//     ctx.fillRect(0, ctx.canvas.height / 2 - 50, ctx.canvas.width, 75);
//     ctx.globalAlpha = 1;
//     ctx.font = "36px 'Gloria Hallelujah', cursive, Arial, serif";
//     ctx.textAlign = "center";
//     ctx.fillStyle = "white";
//     ctx.fillText("Level " + currentLevel, ctx.canvas.width / 2, ctx.canvas.height / 2);
// };
//
//
// /**
//  * Exit the transition level state, start the next level
//  * @method render
//  */
// TransitionLevelState.prototype.exit = function () {
//     if (currentLevel < Object.keys(gameData).length) {
//         start();
//     }
// };
//
// /**
//  * Represents a GameOverState.
//  * @class GameOverState
//  * @constructor
//  * @param {object} actor -  the object that has the finite state machine instance
//  */
// function GameOverState(actor) {
//     this.actor = actor;
// }
//
// /**
//  * Add the event listener
//  * @method enter
//  */
// GameOverState.prototype.enter = function () {
//     document.addEventListener("keyup", gameOverEventHandler, false);
// };
//
// /**
//  * call the render method of the game over state
//  * @method update
//  */
// GameOverState.prototype.update = function (dt) {
//     this.render();
// };
//
// /**
//  * render the game over state
//  * @method render
//  */
// GameOverState.prototype.render = function () {
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     renderMap();
//     renderEnemies();
//     renderGems();
//     renderTimeAndScore();
//     player.render();
//     key.render();
//     ctx.globalAlpha = 0.5;
//     ctx.fillRect(0, 250, ctx.canvas.width, 100);
//     ctx.globalAlpha = 1;
//     ctx.font = "48px 'Gloria Hallelujah', cursive, Arial, serif";
//     ctx.fillStyle = "white";
//     ctx.textAlign = "center";
//     ctx.fillText("GAME OVER", ctx.canvas.width / 2, ctx.canvas.height / 2);
//     ctx.font = "18px 'Gloria Hallelujah', cursive, Arial, serif";
//     ctx.fillText("Press ANY KEY to Continue", ctx.canvas.width / 2, ctx.canvas.height / 2 + 25);
// };
//
// /**
//  * REmove the event listener
//  * @method exit
//  */
// GameOverState.prototype.exit = function () {
//     document.removeEventListener("keyup", gameOverEventHandler, false);
// };
//
// /**
//  * Represents a EndGameState.
//  * @class EndGameState
//  * @constructor
//  * @param {object} actor -  the object that has the finite state machine instance
//  */
// function EndGameState(actor) {
//     this.actor = actor;
// }
//
// /**
//  * Add event listener
//  * @method enter
//  */
// EndGameState.prototype.enter = function () {
//     document.addEventListener("keyup", endGameEventHandler, false);
// };
//
// /**
//  * call the render method of the end game state
//  * @method update
//  */
// EndGameState.prototype.update = function (dt) {
//     this.render();
// };
//
//
// /**
//  * Render the game over screen
//  * @method render
//  */
// EndGameState.prototype.render = function () {
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//     renderMap();
//     renderEnemies();
//     renderGems();
//     renderTimeAndScore();
//     player.render();
//     key.render();
//     ctx.globalAlpha = 0.5;
//     ctx.fillRect(0, 250, ctx.canvas.width, 100);
//     ctx.globalAlpha = 1;
//     ctx.font = "48px 'Gloria Hallelujah', cursive, Arial, serif";
//     ctx.fillStyle = "white";
//     ctx.textAlign = "center";
//     ctx.fillText("CONGRATS!!!!", ctx.canvas.width / 2, ctx.canvas.height / 2);
//     ctx.font = "18px 'Gloria Hallelujah', cursive, Arial, serif";
//     ctx.fillText("Your Score: " + calculateScore(), ctx.canvas.width / 2, ctx.canvas.height / 2 + 25);
// };
//
// /**
//  * Remove the event listener
//  * @method exit
//  */
// EndGameState.prototype.exit = function () {
//     document.removeEventListener("keyup", endGameEventHandler, false);
// };
//
// /* General Functions */
//
// /**
//  * Function event handler for the menu state
//  * @param {event} - event object
//  */
// var menuEventHandler = function (e) {
//     frogger.handleInput(allowedKeys[e.keyCode]);
// };
//
// /**
//  * Function event handler for the playing state
//  * @param {event} - event object
//  */
// var playingEventHandler = function (e) {
//     player.handleInput(allowedKeys[e.keyCode]);
// };
//
// /**
//  * Function event handler for the game over state
//  * @param {event} - event object
//  */
// var gameOverEventHandler = function (e) {
//     frogger.reset();
// };
//
// /**
//  * Function event handler for the end game state
//  * @param {event} - event object
//  */
// var endGameEventHandler = function (e) {
//     frogger.reset();
// };
//
// /**
//  * Define the line equation between to points.
//  * @params {object} p - and object that represent a point (p.x, p.y)on the canvas
//  * @params {object} q - and object that represent a point (q.x, q.y) on the canvas
//  * @return {function} the line equation
//  */
// function construcLineEquation(p, q) {
//     return function (x) {
//         return (((x - p.x) * (q.y - p.y)) / (q.x - p.x)) + p.y;
//     };
// }
//
// /**
//  * Calculate the score by reducing the score array
//  * @return {number}
//  */
// function calculateScore() {
//     var total = score.reduce(function (a, b) {
//         return a + b;
//     });
//     return total.toFixed(2);
// }
//
// /**
//  * Create a two dimension matriz that represent the map of the current level
//  * @param {array} levels - array of string that represent the map and different type of tile
//  * @return {array}
// */
// function createMap(levels) {
//     var mapMatriz = [];
//     levels.forEach(function (row, i) {
//         var mapRow = [];
//         row.split("").forEach(function (tile, j) {
//             switch (tile) {
//             case "W":
//                 mapRow.push(new WaterTile(j, i, "images/water-block.png"));
//                 break;
//             case "G":
//                 mapRow.push(new GrassTile(j, i, "images/grass-block.png"));
//                 break;
//             case "S":
//                 mapRow.push(new StoneTile(j, i, "images/stone-block.png"));
//                 break;
//             case "D":
//                 mapRow.push(new Door(j, i, "images/stone-block.png"));
//                 break;
//             }
//         });
//         mapMatriz.push(mapRow);
//     });
//     return mapMatriz;
// }
//
// /**
//  * Start the current level and set the initial position of the different object
//  */
// function start() {
//     map = createMap(gameData["level" + currentLevel].map);
//     allEnemies = createEnemies(gameData["level" + currentLevel].enemies);
//     gems = createGems(gameData["level" + currentLevel].gems);
//     player = (player) ? player : new Player();
//     player.init(gameData["level" + currentLevel].player_position);
//     key = new Key(
//         gameData["level" + currentLevel].key.x,
//         gameData["level" + currentLevel].key.y,
//         gameData["level" + currentLevel].key.value
//     );
//     frogger = (frogger) ? frogger : new Frogger();
// }
//

//
// /**
//  * create the gem objects according to the level
//  */
// function createGems(data) {
//     var gems = [];
//     data.forEach(function (gem) {
//         gems.push(new Gem(gem.x, gem.y, gem.sprite, gem.time, gem.value));
//     });
//     return gems;
// }
//
// /**
//  * create the enemie objects according to the level
//  */
// function createEnemies(data) {
//     var allEnemies = [];
//     data.forEach(function (enemy) {
//         var aux = new Enemy(enemy.x, enemy.y, enemy.velocity);
//         allEnemies.push(aux);
//     });
//     return allEnemies;
// }
//
// /**
//  * interate over the enenies array to draw them on the canvas
// */
// function renderEnemies() {
//     allEnemies.forEach(function (enemy) {
//         enemy.render();
//     });
// }
//
// /**
//  * interate over the map array to draw it on the canvas
// */
// function renderMap() {
//     map.forEach(function (row) {
//         row.forEach(function (tile) {
//             tile.render();
//         });
//     });
// }
//
// /**
//  * interate over the gems array to draw them on the canvas
// */
// function renderGems() {
//     gems.forEach(function (gem) {
//         gem.render();
//     });
// }
//
// /**
//  * render the timer and the game score
// */
// function renderTimeAndScore() {
//     ctx.font = "18px 'Gloria Hallelujah', cursive, Arial, serif";
//     ctx.textAlign = "right";
//     ctx.fillStyle = "black";
//     ctx.fillText("Score: ", ctx.canvas.width / 2, 45);
//     ctx.fillText(calculateScore() + "pts.", ctx.canvas.width / 2 + 85, 45);
//     if (frogger.finiteStateMachine.currentState == frogger.states.PLAYING) {
//         timer = timer + 1;
//     }
//     ctx.fillText("Level: " + currentLevel, ctx.canvas.width, 25);
//     ctx.textAlign = "center";
//     ctx.fillText("Time: " + parseInt(timer / 60), ctx.canvas.width / 2, 25);
// }
//
// start();

},{"./entities/enemy":2,"./entities/player":4,"./modules/engine":6}],2:[function(require,module,exports){
'use strict';
var Sprite = require('./sprite');
var Resources = require('../modules/resources');
var Constants = require('../utils/constants');

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
  this.drawX = (this.drawX > Constants.CANVAS_WITH) ? (-1 * this.width) : (this.drawX + (this.velocity * dt));
  this.centerX = this.drawX + (this.width * 0.5);
  this.centerY = this.drawY + (this.height * 0.5);
};

/**
* Render the image of the enemy
* @method render
*/
Enemy.prototype.render = function (ctx) {
  console.log("dt");
  ctx.drawImage(Resources.get(this.sprite), this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

module.exports = Enemy;

},{"../modules/resources":7,"../utils/constants":8,"./sprite":5}],3:[function(require,module,exports){
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

},{"../modules/resources":7,"./sprite.js":5}],4:[function(require,module,exports){
'use strict';

var Sprite = require('./sprite');
var Life = require('./life');
var Resources = require('../modules/resources');
/**
 * Represents a Player.
 * @class Player
 * @constructor
 */
function Player() {
  Sprite.call(this, "images/char-boy.png", 0, 63, 0, 0, 101, 83);
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
    this.key = false;
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
    if (!outOfbound(this, newDrawX, newDrawY) && this.checkCondicion(newDrawX, newDrawY)) {
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
Player.prototype.handleInput = function (e) {
    this.checkMovement(e);
};
/**
 * Set the image character of the player
 * @method setSprite
 */
Player.prototype.setSprite = function (sprite) {
    this.sprite = sprite;
}
module.exports = Player;

},{"../modules/resources":7,"./life":3,"./sprite":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
'use strict';
var Resources = require('./resources');
var Constants = require('../utils/constants');
/* Engine.js
* This file provides the game loop functionality (update entities and render),
* draws the initial game board on the screen, and then calls the update and
* render methods on your player and enemy objects (defined in your app.js).
*
* A game engine works by drawing the entire game screen over and over, kind of
* like a flipbook you may have created as a kid. When your player moves across
* the screen, it may look like just that image/character is moving or being
* drawn but that is not the case. What's really happening is the entire "scene"
* is being drawn over and over, presenting the illusion of animation.
*
* This engine is available globally via the Engine variable and it also makes
* the canvas' context (ctx) object globally available to make writing app.js
* a little simpler to work with.
*/

var Engine = (function () {
  /* Predefine the variables we'll be using within this scope,
  * create the canvas element, grab the 2D context for that canvas
  * set the canvas elements height/width and add it to the DOM.
  */
  var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    lastTime,
    entities = [];
  canvas.width = Constants.CANVAS_WIDTH;
  canvas.height = Constants.CANVAS_HEIGHT;
  document.body.appendChild(canvas);

  /* This function is called by the render function and is called on each game
  * tick. It's purpose is to then call the render functions you have defined
  * on your enemy and player entities within app.js
  */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
    * the render function you have defined.
    */
    var renderAllEntities = function (entities) {
      if (entities) {
        for (var i = 0; i < entities.length; i++) {
          if (!Array.isArray(entities[i]) && typeof entities[i].render !== 'undefined') {
            entities[i].render(ctx);
          }
          else {
            return renderAllEntities(entities[i]);
          }
        }
      }
    };
    renderAllEntities(entities);
  }

  /* This function initially draws the "game level", it will then call
  * the renderEntities function. Remember, this function is called every
  * game tick (or loop of the game engine) because that's how games work -
  * they are flipbooks creating the illusion of animation but in reality
  * they are just drawing the entire screen over and over.
  */
  function render() {
    /* This array holds the relative URL to the image used
    * for that particular row of the game level.
    */
    var rowImages = [
      'images/water-block.png', // Top row is water
      'images/stone-block.png', // Row 1 of 3 of stone
      'images/stone-block.png', // Row 2 of 3 of stone
      'images/stone-block.png', // Row 3 of 3 of stone
      'images/grass-block.png', // Row 1 of 2 of grass
      'images/grass-block.png' // Row 2 of 2 of grass
    ],
    numRows = 6,
    numCols = 5,
    row, col;
    /* Loop through the number of rows and columns we've defined above
    * and, using the rowImages array, draw the correct image for that
    * portion of the "grid"
    */
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        /* The drawImage function of the canvas' context element
        * requires 3 parameters: the image to draw, the x coordinate
        * to start drawing and the y coordinate to start drawing.
        * We're using our Resources helpers to refer to our images
        * so that we get the benefits of caching these images, since
        * we're using them over and over.
        */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }
    renderEntities();
  }

  /* This is called by the update function  and loops through all of the
  * objects within your allEnemies array as defined in app.js and calls
  * their update() methods. It will then call the update function for your
  * player object. These update methods should focus purely on updating
  * the data/properties related to  the object. Do your drawing in your
  * render methods.
  */
  function updateEntities(dt) {
    var updateAllEntities = function (entities) {
      if (entities) {
        for (var i = 0; i < entities.length; i++) {
          if (!Array.isArray(entities[i]) && typeof entities[i].update !== 'undefined') {
            entities[i].update(dt);
          }
          else {
            return updateAllEntities(entities[i]);
          }
        }
      }
    };
    updateAllEntities(entities);
  }

  /* This function is called by main (our game loop) and itself calls all
  * of the functions which may need to update entity's data. Based on how
  * you implement your collision detection (when two entities occupy the
  * same space, for instance when your character should die), you may find
  * the need to add an additional function call here. For now, we've left
  * it commented out - you may or may not want to implement this
  * functionality this way (you could just implement collision detection
  * on the entities themselves within your app.js file).
  */
  function update(dt) {
    updateEntities(dt);
    // checkCollisions();
  }

  /* This function serves as the kickoff point for the game loop itself
  * and handles properly calling the update and render methods.
  */
  function main() {
    /* Get our time delta information which is required if your game
    * requires smooth animation. Because everyone's computer processes
    * instructions at different speeds we need a constant value that
    * would be the same for everyone (regardless of how fast their
    * computer is) - hurray time!
    */
    var now = Date.now(),
    dt = (now - lastTime) / 1000.0;
    /* Call our update/render functions, pass along the time delta to
    * our update function since it may be used for smooth animation.
    */
    update(dt);
    render();

    /* Set our lastTime variable which is used to determine the time delta
    * for the next time this function is called.
    */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
    * function again as soon as the browser is able to draw another frame.
    */
    window.requestAnimationFrame(main);
  }

  /* This function does nothing but it could have been a good place to
  * handle game reset states - maybe a new game menu or a game over screen
  * those sorts of things. It's only called once by the init() method.
  */
  function reset() {
    // noop
  }

  /* This function does some initial setup that should only occur once,
  * particularly setting the lastTime variable that is required for the
  * game loop.
  */
  function init() {
    reset();
    lastTime = Date.now();
    main();
  }

  /* Go ahead and load all of the images we know we're going to need to
  * draw our game level. Then set init as the callback method, so that when
  * all of these images are properly loaded our game will start.
  */


  /* Assign the canvas' context object to the global variable (the window
  * object when run in a browser) so that developer's can use it more easily
  * from within their app.js files.
  */
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png',
    'images/key.png',
    'images/gem-blue.png',
    'images/gem-green.png',
    'images/gem-orange.png',
    'images/heart.png',
    'images/Selector.png',
    'images/door.png'
  ]);
  Resources.onReady(init);

  return {
    subscribeEntity: function(entity) {
      entities.push(entity);
    },
    unsubscribeEntity: function(entity) {
      var index = this.observers.indexOf(entity);
      if(index > -1) {
        this.observers.splice(index, 1);
      }
    }
  };
})();
module.exports = Engine;

},{"../utils/constants":8,"./resources":7}],7:[function(require,module,exports){
'use strict';

/* Resources.js
* This is simple an image loading utility. It eases the process of loading
* image files so that they can be used within your game. It also includes
* a simple "caching" layer so it will reuse cached images if you attempt
* to load the same image multiple times.
*/
var Resources = (function() {
  var resourceCache = {};
  var readyCallbacks = [];

  /* This function determines if all of the images that have been requested
  * for loading have in fact been completed loaded.
  */
  function isReady() {
    var ready = true;
    for(var k in resourceCache) {
      if(resourceCache.hasOwnProperty(k) &&
      !resourceCache[k]) {
        ready = false;
      }
    }
    return ready;
  }

  /* This is our private image loader function, it is
  * called by the public image loader function.
  */
  function _load(url) {
    if(resourceCache[url]) {
      /* If this URL has been previously loaded it will exist within
      * our resourceCache array. Just return that image rather
      * re-loading the image.
      */
      return resourceCache[url];
    }
    else {
      /* This URL has not been previously loaded and is not present
      * within our cache; we'll need to load this image.
      */
      var img = new Image();
      img.onload = function() {
        /* Once our image has properly loaded, add it to our cache
        * so that we can simply return this image if the developer
        * attempts to load this file in the future.
        */
        resourceCache[url] = img;

        /* Once the image is actually loaded and properly cached,
        * call all of the onReady() callbacks we have defined.
        */
        if(isReady()) {
          readyCallbacks.forEach(function(func) { func(); });
        }
      };

      /* Set the initial cache value to false, this will change when
      * the image's onload event handler is called. Finally, point
      * the images src attribute to the passed in URL.
      */
      resourceCache[url] = false;
      img.src = url;
    }
  }

  /* This is the publicly accessible image loading function. It accepts
  * an array of strings pointing to image files or a string for a single
  * image. It will then call our private image loading function accordingly.
  */
  function load(urlOrArr) {
    if(urlOrArr instanceof Array) {
      /* If the developer passed in an array of images
      * loop through each value and call our image
      * loader on that image file
      */
      urlOrArr.forEach(function(url) {
        _load(url);
      });
    }
    else {
      /* The developer did not pass an array to this function,
      * assume the value is a string and call our image loader
      * directly.
      */
      _load(urlOrArr);
    }
  }

  /* This is used by developer's to grab references to images they know
  * have been previously loaded. If an image is cached, this functions
  * the same as calling load() on that URL.
  */
  function get(url) {
    return resourceCache[url];
  }
  /* This function will add a function to the callback stack that is called
  * when all requested images are properly loaded.
  */
  function onReady(func) {
    readyCallbacks.push(func);
  }
  /* This object defines the publicly accessible functions available to
  * developers by creating a global Resources object.
  */
  return {
    load: load,
    get: get,
    onReady: onReady,
    isReady: isReady
  };
})();

module.exports = Resources;

},{}],8:[function(require,module,exports){
'use strict';

module.exports = Object.freeze({
    CANVAS_WIDTH: 505,
    CANVAS_HEIGHT: 606
});

},{}]},{},[1])
//# sourceMappingURL=app.js.map
