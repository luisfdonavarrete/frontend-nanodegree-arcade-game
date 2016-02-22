'use strict';

function LevelInfo (map, key, gems, enemies, playerPosition, endPosition) {
  this.map = map;
  this.key = key;
  this.gems =  gems;
  this.enemies = enemies;
  this.playerPosition = playerPosition;
  this.endPosition = endPosition;
}
module.exports = LevelInfo;
