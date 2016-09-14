var GameObject = require('./gameobject.js');

function Asteroid(game, x, y, sprite){
    GameObject.call(this, game, x, y, sprite);
}

Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Asteroid.prototype.constructor = Asteroid;

module.exports = Asteroid;