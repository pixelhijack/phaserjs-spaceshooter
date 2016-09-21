var GameObject = require('./gameobject.js');

function Ship(game, x, y, sprite){
    GameObject.call(this, game, x, y, sprite);
    this.scale.x *= -1;
    
    this.props = {};
    
    this.update = function(){
        // this.body.rotation = this.body.angle * 180 / Math.PI;
    };
}

Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

module.exports = Ship;