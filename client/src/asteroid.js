var GameObject = require('./gameobject.js');

function Asteroid(game, x, y, sprite, props){
    
    GameObject.call(this, game, x, y, sprite, props);
    this.setId();
    this.body.bounce.setTo(1, 1);
    this.body.collideWorldBounds = true;
}

Asteroid.prototype = Object.create(GameObject.prototype);
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.onHit = function(event){
    if(event.type === 'HIT' && event.target === this.id){
        this.setState('EXPLODE', this.game.time.now + 100);
        this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function(){
            this.setState('DIE', this.game.time.now + 300);
        }, this);
    }
};

module.exports = Asteroid;