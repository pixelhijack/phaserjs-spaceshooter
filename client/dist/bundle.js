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
/*!*****************************!*\
  !*** ./client/src/index.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var AsteroidAdventures = __webpack_require__(/*! ./game.js */ 1);
	
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

/***/ },
/* 1 */
/*!****************************!*\
  !*** ./client/src/game.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	var Ship = __webpack_require__(/*! ./ship.js */ 2);
	var Asteroid = __webpack_require__(/*! ./asteroid.js */ 4);
	
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

/***/ },
/* 2 */
/*!****************************!*\
  !*** ./client/src/ship.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	var GameObject = __webpack_require__(/*! ./gameobject.js */ 3);
	
	function Ship(game, x, y, sprite){
	    GameObject.call(this, game, x, y, sprite);
	    this.scale.x *= -1;
	    
	    this.update = function(){
	        this.body.rotation = this.body.angle * 180 / Math.PI;
	    };
	}
	
	Ship.prototype = Object.create(Phaser.Sprite.prototype);
	Ship.prototype.constructor = Ship;
	
	module.exports = Ship;

/***/ },
/* 3 */
/*!**********************************!*\
  !*** ./client/src/gameobject.js ***!
  \**********************************/
/***/ function(module, exports) {

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
	
	module.exports = GameObject;

/***/ },
/* 4 */
/*!********************************!*\
  !*** ./client/src/asteroid.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	var GameObject = __webpack_require__(/*! ./gameobject.js */ 3);
	
	function Asteroid(game, x, y, sprite){
	    GameObject.call(this, game, x, y, sprite);
	}
	
	Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
	Asteroid.prototype.constructor = Asteroid;
	
	module.exports = Asteroid;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map