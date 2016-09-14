var AsteroidAdventures = require('./game.js');

var configs = {
    WIDTH: 512,
    HEIGHT: 512,
    DOM_ELEMENT: 'game'
};
var game = new Phaser.Game(configs.WIDTH, configs.HEIGHT, Phaser.AUTO, configs.DOM_ELEMENT);
game.state.add('AsteroidAdventures', AsteroidAdventures);
game.state.start('AsteroidAdventures', true, true, { 
    initialConfig: 'some initial state'
});