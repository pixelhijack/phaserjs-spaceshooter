var GameObject = require('./gameobject.js');

function Asteroid(game, x, y, sprite){
    var asteroidSprites = ['01','02','03','04','05','06','07','08'], 
        aRandomSprite = Math.floor(Math.random() * asteroidSprites.length),
        aRandomSize = Math.random() * 0.2 + 1;
    
    GameObject.call(this, game, x, y, sprite);
    this.setId();
    this.animations.add('idle', [aRandomSprite], 10, true);
    this.body.bounce.setTo(1, 1);
    this.body.collideWorldBounds = true;
    this.scale.x *= aRandomSize;
    this.scale.y *= aRandomSize;
    
    this.update = function(){
        this.animations.play('idle');
    };
    
    this.onHit = function(event){
        if(event.type === 'HIT'){
            this.kill();
        }
    };
}

Asteroid.prototype = Object.create(GameObject.prototype);
Asteroid.prototype.constructor = Asteroid;

module.exports = Asteroid;