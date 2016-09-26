var actionTypes = require('./actionTypes.js');
var GameObject = require('./gameobject.js');

function Ship(game, x, y, sprite, props){
    GameObject.call(this, game, x, y, sprite);
    this.body.collideWorldBounds = true;
    this.scale.x *= -1;
    
    this.props = props;
    
    this.bullets = this.game.add.group();
    
    this.state = {
        queue: [],
        current: []
    };
    
    this.setState = function(state){
        this.state.queue.push(state);
    };
    
    this.updateState = function(){
        var next = this.state.queue.shift();
        this.state.current.push(next);
        // too much in queue... :'( '
        console.log('[STATE] %s queue, current: ', this.state.queue.length, JSON.stringify(this.state.current));
        this.state.current.forEach(function(state, i){
            this.react(state);
            if(!state.time || state.time < this.game.time.now){
                this.state.current.splice(i, 1);
            }
        }.bind(this));
    };
    
    this.hasState = function(state){
        return this.state.current.some(function(currentState){
            return currentState.type === state;
        });
    };
    
    this.shoot = function(){
        
        var bullet = this.bullets.getFirstDead();
        if(!bullet || this.hasState(actionTypes.SHOOT)){ 
            return; 
        }
        bullet.revive();
        bullet.reset(this.x, this.y);

        // Shoot it
        bullet.rotation = this.rotation;
        game.physics.arcade.velocityFromRotation(this.rotation, 400, bullet.body.velocity);
    };
    
    this.update = function(){
        this.updateState();
    };
    
    this.react = function(event){
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