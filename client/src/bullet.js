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
        this.setState({ type: 'EXPLODE', priority: 3, time: this.game.time.now + 100 });
        this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function(){
            this.setState({ type: 'DIE', priority: 10, time: this.game.time.now + 300 });
        }, this);
    }
};

module.exports = Bullet;