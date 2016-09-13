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
        ship;
    
    this.init = function(config){
        console.log('[PHASER] init', config);
    };
    this.preload = function(){
        console.log('[PHASER] preload');
        this.game.load.atlas('ships', '../assets/ships.png', '../assets/ships.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    };
    this.create = function(){
        console.log('[PHASER] create');
        
        ship = this.game.add.sprite(100, 100, 'ships');
        ship.animations.add('idle', ['43'], 10, true);
        this.game.add.existing(ship);
        this.game.physics.enable(ship, Phaser.Physics.ARCADE);
        
        keys = this.game.input.keyboard.createCursorKeys();
        keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    };
    this.update = function(){
        console.log('[PHASER] update');
        ship.animations.play('idle');
        if(keys.right.isDown){
            ship.body.velocity.x++;
        }
        if(keys.left.isDown){
            ship.body.velocity.x--;
        }
        if(keys.up.isDown){
            ship.body.velocity.y--;
        }
        if(keys.down.isDown){
            ship.body.velocity.y++;
        }
    };
}