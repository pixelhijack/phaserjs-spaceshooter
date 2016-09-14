/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ function(module, exports) {

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
	        
	    var ACC = 3;
	    
	    this.init = function(config){
	        console.log('[PHASER] init', config);
	    };
	    this.preload = function(){
	        console.log('[PHASER] preload');
	        this.game.load.atlas('ships', '../assets/ships.png', '../assets/ships.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
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
	        
	        keys = this.game.input.keyboard.createCursorKeys();
	        keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	    };
	    this.update = function(){
	        console.log('[PHASER] update');
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

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map