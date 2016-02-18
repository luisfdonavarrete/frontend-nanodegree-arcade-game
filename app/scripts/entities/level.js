'use strict';

function Level (map, key, gems, enemies, player_position, end_position) {
  this.map = map;
  this.key = key; /* Key Object */
  this.gems =  gems; /* Array of gem objects */
  this.enemies = enemies; /* Array of enemy objects */
  this.player_position = player_position; /* general object */
  this.end_position = end_position; /* general object */
}
module.exports = Level;
