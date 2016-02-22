'use strict';
var TileMap = require('./tile-map');

function Map (mapMatriz) {
  this.mapMatriz = [];

  function createMap(matriz) {
    var result = [];
    matriz.forEach(function (row, i) {
      var rowMap = [];
      row.split('').forEach(function (tile, j) {
        switch (tile) {
          case 'W':
            rowMap.push(new TileMap(j, i, 'water'));
            break;
          case 'G':
            rowMap.push(new TileMap(j, i, 'grass'));
            break;
          case 'S':
            rowMap.push(new TileMap(j, i, 'stone'));
            break;
          // case 'D':
          //   row.push(new Door(j, i, 'images/stone-block.png'));
          // break;
        }
      });
      result.push(rowMap);
    });
    this.mapMatriz = result;
  }
  createMap.call(this, mapMatriz);
}

Map.prototype.render = function (ctx) {
  this.mapMatriz.forEach(function (row) {
      row.forEach(function (tile) {
          tile.render(ctx);
      });
  });
};

module.exports = Map;
