var GameObject = require('./gameobject.js');

function Bullet(game, x, y, sprite){
    
    var explosion;
    
    this.state = 'idle';
    
    GameObject.call(this, game, x, y, sprite);
    this.setId();
    this.animations.add('idle', ['44'], 10, true);
    explosion = this.animations.add('explode', ['60', '63', '64'], 10, false);
    explosion.onComplete.add(function(){
        this.kill();
        this.state = 'idle';
    }, this);
    this.outOfBoundsKill = true;
    this.checkWorldBounds = true;
    this.allowRotation = true;
    
    this.update = function(){
        this.animations.play(this.state);
    };
    
    this.explode = function(event){
        if(event.type === 'HIT'){
            this.state = 'explode';
        }
    };
}

Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.constructor = Bullet;

module.exports = Bullet;