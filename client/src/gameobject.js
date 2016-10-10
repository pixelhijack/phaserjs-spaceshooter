function GameObject(game, x, y, sprite, props){
    
    this.game = game;
    this.props = props || { animations: [] };
    
    // state object: { type: 'STUN', time: 12077484, priority: 1 }
    this.state = [];
    this.DEFAULT_STATE = {
        type: 'IDLE',
        time: 0,
        priority: 0
    };
    
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.setId();
    
    this.props.animations.forEach(function(animation){
        this.animations.add(animation.name, animation.frames, animation.fps, animation.loop);
    }.bind(this));
    
    this._debugText = this.addChild(this.game.add.text(20, -20, 'debug', { font: "12px Arial", fill: "#ffffff" }));
    this._debugText.visible = false;
    
    this.game.add.existing(this);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(0.5, 0.5);
}

GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;

GameObject.prototype.listen = function(eventSource, callback){
    eventSource.add(callback, this);
};

GameObject.prototype.onEvents = function(event){
    console.log('[%s]: ', this.constructor.name, event);
};

GameObject.prototype.setState = function(state){
    this.state.push(state);
};

GameObject.prototype.clearState = function(state){
    this.state = this.state.filter(function(state){
        return state.time > this.game.time.now;
    }.bind(this));
};

GameObject.prototype.getState = function(){
    // 1. default if no other
    // 2. highest priority, pop
    // 3. longest time-span
    if(!this.state.length){
        return this.DEFAULT_STATE;
    }
    return this.state[0];
};

GameObject.prototype.hasState = function(stateToTest){
    return this.state.some(function(state){
        return state.type === stateToTest && state.time > this.game.time.now;
    }.bind(this));
};

GameObject.prototype.update = function(){
    if(!this.state){ return; }
    console.log('state length: ', this.state.length);
    var state = this.getState();
    this.animations.play(state.type);
    this.clearState();
};

GameObject.prototype.setId = function(){
    this.id = this.constructor.name + '-' +
        (this.x | 0) + '-' +
        (this.y | 0) + '-' +
        Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

};

GameObject.prototype.debug = function(toDebug){
  this._debugText.visible = true;
  this._debugText.setText(toDebug || '');
};

module.exports = GameObject;