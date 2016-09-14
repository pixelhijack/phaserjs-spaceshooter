var configs = {
    WIDTH: 1000,
    HEIGHT: 1000,
    DOM_ELEMENT: 'app'
};
var game = new Phaser.Game(configs.WIDTH, configs.HEIGHT, Phaser.AUTO, configs.DOM_ELEMENT);
game.state.add('AsteroidAdventures', AsteroidAdventures);
game.state.start('AsteroidAdventures', true, true, { 
    initialConfig: 'some initial state'
});

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
        
        ship = this.game.add.sprite(this.world.centerX, this.world.centerY, 'ships');
        ship.animations.add('idle', ['43'], 10, true);
        this.game.add.existing(ship);
        this.game.physics.enable(ship, Phaser.Physics.ARCADE);
        ship.body.collideWorldBounds = true;
        ship.anchor.setTo(0.5,0.5);
        ship.scale.x *= -1;
        
        asteroid =  this.game.add.sprite(200, 200, 'asteroids');
        asteroid.animations.add('idle', ['03'], 10, true);
        asteroid.animations.play('idle');
        this.game.add.existing(asteroid);
        this.game.physics.enable(asteroid, Phaser.Physics.ARCADE);
        ship.anchor.setTo(0.5,0.5);
        asteroid.body.collideWorldBounds = true;
        asteroid.body.velocity.x += Math.random() * 50;
        asteroid.body.velocity.y += Math.random() * 50;
        
        keys = this.game.input.keyboard.createCursorKeys();
        keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    };
    this.update = function(){
        console.log('[PHASER] update');
        
        game.physics.arcade.collide(ship, asteroid);
        
        ship.animations.play('idle');
        ship.body.rotation = ship.body.angle * 180 / Math.PI;
        
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