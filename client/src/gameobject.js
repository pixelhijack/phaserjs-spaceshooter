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

GameObject.prototype.on = function(eventSource, callback){
    eventSource.add(callback, this);
};

module.exports = GameObject;