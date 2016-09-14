var Ship = require('./ship.js');
var Asteroid = require('./asteroid.js');

function AsteroidAdventures(){
    var keys, 
        ship, 
        asteroid;
        
    var ACC = 3;
    
    this.init = function(config){
        console.log('[PHASER] init', config);
    };
    this.preload = function(){
        console.log('[PHASER] preload');
        this.game.load.atlas('ships', '../assets/ships.png', '../assets/ships.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        this.game.load.atlas('asteroids', '../assets/asteroids.png', '../assets/asteroids.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    };
    this.create = function(){
        console.log('[PHASER] create');
        
        ship = new Ship(this.game, this.world.centerX, this.world.centerY, 'ships');
        ship.animations.add('idle', ['43'], 10, true);
        
        asteroid =  new Asteroid(this.game, 200, 200, 'asteroids');
        asteroid.animations.add('idle', ['03'], 10, true);
        
        asteroid.body.velocity.x += Math.random() * 50;
        asteroid.body.velocity.y += Math.random() * 50;
        
        keys = this.game.input.keyboard.createCursorKeys();
        keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    };
    this.update = function(){
        console.log('[PHASER] update');
        
        this.game.physics.arcade.collide(ship, asteroid);
        
        ship.animations.play('idle');
        asteroid.animations.play('idle');
        
        
        if(keys.right.isDown){
            ship.body.velocity.x += ACC;
        }
        if(keys.left.isDown){
            ship.body.velocity.x -= ACC;
        }
        if(keys.up.isDown){
            ship.body.velocity.y -= ACC;
        }
        if(keys.down.isDown){
            ship.body.velocity.y += ACC;
        }
    };
}

module.exports = AsteroidAdventures;