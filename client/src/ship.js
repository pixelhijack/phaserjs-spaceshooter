var GameObject = require('./gameobject.js');

function Ship(game, x, y, sprite, props){
    GameObject.call(this, game, x, y, sprite, props);
    this.setId();
    this.body.collideWorldBounds = true;
    this.scale.x *= -1;
    
    this.bullets = this.game.add.group();
    
    this.shoot = function(){

        if(this.hasState('SHOOT')){
            return;
        }
        
        this.setState('SHOOT', this.game.time.now + this.props.SHOT_DELAY);
        
        var bullet = this.bullets.getFirstDead();
        if(!bullet){ 
            return; 
        }
        bullet.revive();
        bullet.reset(this.x, this.y);

        // Shoot it
        bullet.rotation = this.rotation;
        game.physics.arcade.velocityFromRotation(this.rotation, 400, bullet.body.velocity);
    };
    
    this.onEvents = function(event){
        switch(event.type){
            case 'MOVE': 
                onMove.call(this, event);
                break;
            case 'SHOOT':
                onShoot.call(this, event);
                break;
            case 'COLLISION':
                onCollision.call(this, event);
                break;
        }
    };
}

Ship.prototype = Object.create(GameObject.prototype);
Ship.prototype.constructor = Ship;

// reducers: 
function onMove(event){
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

function onShoot(event){
    this.shoot();
}

function onCollision(event){
    
}

module.exports = Ship;