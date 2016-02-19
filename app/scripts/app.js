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
