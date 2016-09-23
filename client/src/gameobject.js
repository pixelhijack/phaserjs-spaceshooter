function GameObject(game, x, y, sprite){
    this.game = game;
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.game.add.existing(this);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
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

module.exports = GameObject;