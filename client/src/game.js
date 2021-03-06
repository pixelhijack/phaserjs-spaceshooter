var actionTypes = require('./actionTypes.js');
var Ship = require('./ship.js');
var Asteroid = require('./asteroid.js');
var Bullet = require('./bullet.js');

function AsteroidAdventures(){
    var keys, 
        ship, 
        asteroids;
        
    this.eventsOf = {
        keys: new Phaser.Signal(),
        collision: new Phaser.Signal()
    };
    
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
        
        // for fps debugging
        this.game.time.advancedTiming = true;
        
        ship = new Ship(this.game, this.world.centerX, this.world.centerY, 'ships', {
            ROTATION_SPEED: 180, // degrees/second
            ACCELERATION: 200, // pixels/second/second
            MAX_SPEED: 250, // pixels/second
            NUMBER_OF_BULLETS: 10,
            SHOT_DELAY: 200, 
            animations: [
                { name: 'DEFAULT', frames: ['43'], fps: 10, loop: true }    
            ]
        });
        
        // load those freakin bullets!
        for(var i = 0; i < ship.props.NUMBER_OF_BULLETS; i++) {
            var bullet = new Bullet(this.game, 0, 0, 'ships', {
                animations: [
                    { 
                        name: 'DEFAULT', 
                        frames: ['44'], 
                        fps: 10, 
                        loop: true
                    }, { 
                        name: 'EXPLODE', 
                        frames: ['60', '63', '64'], 
                        fps: 10, 
                        loop: true
                    }, { 
                        name: 'DIE', 
                        frames: ['60', '63', '64'], 
                        fps: 10, 
                        loop: false
                    }
                ]
            });
            bullet.listen(this.eventsOf.collision, bullet.explode);
            ship.bullets.add(bullet);
            bullet.kill();
        }
        
        asteroids = this.game.add.group();
        
        var asteroidSprites = ['01','02','03','04','05','06','07','08'];
        
        for(var j=0;j<50;j++){
            var asteroid =  new Asteroid(this.game, Math.random() * this.world.width, Math.random() * this.world.height, 'asteroids', {
                animations: [
                    { 
                        name: 'DEFAULT', 
                        frames: [Math.floor(Math.random() * asteroidSprites.length)], 
                        fps: 10, 
                        loop: true
                    }
                ]
            });
            asteroid.body.velocity.x = asteroid.body.velocity.x + Math.random() * 50 - Math.random() * 50;
            asteroid.body.velocity.y = asteroid.body.velocity.y + Math.random() * 50 - Math.random() * 50;
            asteroids.add(asteroid);
            asteroid.listen(this.eventsOf.collision, asteroid.onHit);
        }
        
        ship.listen(this.eventsOf.keys, ship.onEvents);
        ship.listen(this.eventsOf.collision, ship.onEvents);
        
        keys = this.game.input.keyboard.createCursorKeys();
        keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    };
    this.update = function(){
        //console.log('[PHASER] update');
        
        // fps debugging 
        this.game.debug.text(this.game.time.fps, 5, 20);
        
        asteroids.forEachAlive(function(sprite){
            sprite.debug(sprite.id);
        });
        
        this.game.physics.arcade.collide(ship, asteroids, function(){
            this.eventsOf.collision.dispatch({ type: actionTypes.COLLISION });
        }.bind(this));
        
        this.game.physics.arcade.overlap(ship.bullets, asteroids, function(bullet, asteroid){
            this.eventsOf.collision.dispatch({ type: actionTypes.HIT, target: asteroid.id });
        }.bind(this));
        
        if(keys.left.isDown){
            this.eventsOf.keys.dispatch({ type: actionTypes.MOVE, key: 'left' });
        } else if(keys.right.isDown){
            this.eventsOf.keys.dispatch({ type: actionTypes.MOVE, key: 'right' });
        } else {
            this.eventsOf.keys.dispatch({ type: actionTypes.MOVE, key: 'no-rotate' });
        }
        
        if(keys.up.isDown){
            this.eventsOf.keys.dispatch({ type: actionTypes.MOVE, key: 'up' });
        } else {
            this.eventsOf.keys.dispatch({ type: actionTypes.MOVE, key: 'no-thrust' });
        }
        
        if(keys.space.isDown){
            this.eventsOf.keys.dispatch({ type: actionTypes.SHOOT, time: this.game.time.now });
        }
    };
}

module.exports = AsteroidAdventures;