var hasId = require('./mixins/hasId.js');

function GameObject(game, x, y, sprite, props){
    
    this.game = game;
    this.props = props || { animations: [] };
    
    // states order represent interruption priority
    this.state = {
        'DIE': 0,
        'STUN': 0,
        'SHOOT': 0,
        'DEFAULT': Infinity
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

GameObject.prototype = Object.assign(GameObject.prototype, hasId);

GameObject.prototype.listen = function(eventSource, callback){
    eventSource.add(callback, this);
};

GameObject.prototype.onEvents = function(event){
    console.log('[%s]: ', this.constructor.name, event);
};

GameObject.prototype.setState = function(type, time){
    if(this.state[type] !== undefined){
        this.state[type] = time;
    }
};

GameObject.prototype.getState = function(){
    for(var type in this.state){
        if(this.game.time.now < this.state[type]){
            return type;
        }
    }
    return 'DEFAULT';
};

GameObject.prototype.hasState = function(type){
    return this.state[type] !== undefined ? this.state[type] >= this.game.time.now : undefined;  
};

GameObject.prototype.update = function(){
    if(this.hasState('DIE')){ this.kill(); }
    var state = this.getState();
    this.animations.play(state);
};

GameObject.prototype.debug = function(toDebug){
  this._debugText.visible = true;
  this._debugText.setText(toDebug || '');
};

module.exports = GameObject;