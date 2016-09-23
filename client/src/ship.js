var GameObject = require('./gameobject.js');

function Ship(game, x, y, sprite, props){
    GameObject.call(this, game, x, y, sprite);
    this.scale.x *= -1;
    
    this.props = props;
    
    this.update = function(){
        // this.body.rotation = this.body.angle * 180 / Math.PI;
    };
    
    this.onEvents = function(event){
        switch(event.type){
            case 'KEY': 
                onKeyPress.call(this, event);
                break;
            case 'COLLISION':
                onCollision.call(this, event);
        }
    };
}

Ship.prototype = Object.create(GameObject.prototype);
Ship.prototype.constructor = Ship;

// reducers: 
function onKeyPress(event){
    switch (event.key) {
        case 'left':
            this.body.angularVelocity = -this.props.ROTATION_SPEED;
            break;
        case 'right':
            this.body.angularVelocity = this.props.ROTATION_SPEED;
            break;
        case 'no-rotate':
            this.body.angularVelocity = 0;
            break;
        case 'up':
            this.body.acceleration.x = Math.cos(this.rotation) * this.props.ACCELERATION;
            this.body.acceleration.y = Math.sin(this.rotation) * this.props.ACCELERATION;
            break;
        case 'no-thrust':
            this.body.acceleration.setTo(0, 0);
            break;
    }
}

function onCollision(event){
    
}

module.exports = Ship;