var GameObject = require('./gameobject.js');

function Bullet(game, x, y, sprite, props){
    
    GameObject.call(this, game, x, y, sprite, props);
    this.setId();
    
    this.outOfBoundsKill = true;
    this.checkWorldBounds = true;
    this.allowRotation = true;
}

Bullet.prototype = Object.create(GameObject.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.explode = function(event){
    if(event.type === 'HIT'){
        this.setState('EXPLODE', this.game.time.now + 200);
        this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function(){
            this.setState('DIE', this.game.time.now + 300);
        }, this);
    }
};

module.exports = Bullet;