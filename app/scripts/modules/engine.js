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

  /* This function initially draws the "game level", it will then call
  * the renderEntities function. Remember, this function is called every
  * game tick (or loop of the game engine) because that's how games work -
  * they are flipbooks creating the illusion of animation but in reality
  * they are just drawing the entire screen over and over.
  */
  function render() {
    var renderEntities = function (entities) {
      if (entities) {
        for (var i = 0, len = entities.length; i < len; i++) {
          if (!Array.isArray(entities[i]) && typeof entities[i].render !== 'undefined') {
            entities[i].render(ctx);
          }
          else {
            renderEntities(entities[i]);
          }
        }
      }
    };
    renderEntities(entities);
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
    var updateEntities = function (entities) {
      if (entities) {
        for (var i = 0, len = entities.length; i < len; i++) {
          if (!Array.isArray(entities[i]) && typeof entities[i].update !== 'undefined') {
            entities[i].update(dt);
          }
          else {
            updateEntities(entities[i]);
          }
        }
      }
    };
    updateEntities(entities);
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
