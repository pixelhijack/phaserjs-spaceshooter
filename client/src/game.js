var Ship = require('./ship.js');
var Asteroid = require('./asteroid.js');

function AsteroidAdventures(){
    var keys, 
        ship, 
        asteroids;
        
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
        
        ship = new Ship(this.game, this.world.centerX, this.world.centerY, 'ships', {
            ROTATION_SPEED: 180, // degrees/second
            ACCELERATION: 200, // pixels/second/second
            MAX_SPEED: 250 // pixels/second
        });
        ship.animations.add('idle', ['43'], 10, true);
        
        asteroids = this.game.add.group();
        
        for(var i=0;i<50;i++){
            var asteroid =  new Asteroid(this.game, Math.random() * this.world.width, Math.random() * this.world.height, 'asteroids');
            asteroid.body.velocity.x = asteroid.body.velocity.x + Math.random() * 50 - Math.random() * 50;
            asteroid.body.velocity.y = asteroid.body.velocity.y + Math.random() * 50 - Math.random() * 50
            asteroids.add(asteroid);
        }
        
        this.keyEvents = new Phaser.Signal();
        this.collisionEvents = new Phaser.Signal();
        
        ship.listen(this.keyEvents, ship.onEvents);
        ship.listen(this.collisionEvents, ship.onEvents);
        
        keys = this.game.input.keyboard.createCursorKeys();
        keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    };
    this.update = function(){
        console.log('[PHASER] update');
        
        this.game.physics.arcade.collide(ship, asteroids, function(){
            this.collisionEvents.dispatch({ type: 'COLLISION' });
        }.bind(this));
        
        ship.animations.play('idle');
        
        if(keys.left.isDown){
            ship.body.angularVelocity = -ship.props.ROTATION_SPEED;
        } else if(keys.right.isDown){
            ship.body.angularVelocity = ship.props.ROTATION_SPEED;
        } else {
            ship.body.angularVelocity = 0;
        }
        
        if(keys.up.isDown){
            this.keyEvents.dispatch({ type: 'KEY_UP' });
            ship.body.acceleration.x = Math.cos(ship.rotation) * ship.props.ACCELERATION;
            ship.body.acceleration.y = Math.sin(ship.rotation) * ship.props.ACCELERATION;
        } else {
            ship.body.acceleration.setTo(0, 0);
        }
    };
}

module.exports = AsteroidAdventures;