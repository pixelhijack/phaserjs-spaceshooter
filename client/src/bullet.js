var GameObject = require('./gameobject.js');

function Bullet(game, x, y, sprite){
    
    GameObject.call(this, game, x, y, sprite);
    this.animations.add('idle', ['44'], 10, true);
    this.outOfBoundsKill = true;
    this.checkWorldBounds = true;
    this.allowRotation = true;
    
    this.update = function(){
        this.animations.play('idle');
    };
}

Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.constructor = Bullet;

module.exports = Bullet;