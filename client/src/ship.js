var GameObject = require('./gameobject.js');

function Ship(game, x, y, sprite, props){
    GameObject.call(this, game, x, y, sprite);
    this.scale.x *= -1;
    
    this.props = props;
    
    this.update = function(){
        // this.body.rotation = this.body.angle * 180 / Math.PI;
    };
}

Ship.prototype = Object.create(GameObject.prototype);
Ship.prototype.constructor = Ship;

module.exports = Ship;