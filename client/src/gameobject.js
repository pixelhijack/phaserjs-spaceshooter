function GameObject(game, x, y, sprite){
    this.game = game;
    
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.setId();
    
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

GameObject.prototype.setId = function(){
    this.id = this.constructor.name + '-' + (this.x | 0) + '-' + (this.y | 0);
};

GameObject.prototype.debug = function(toDebug){
  this._debugText.visible = true;
  this._debugText.setText(toDebug || '');
};

module.exports = GameObject;