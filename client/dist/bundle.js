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
	        
	        ship.listen(this.eventsOf.keys, ship.onEvents);
	        ship.listen(this.eventsOf.collision, ship.onEvents);
	        
	        keys = this.game.input.keyboard.createCursorKeys();
	        keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	    };
	    this.update = function(){
	        console.log('[PHASER] update');
	        
	        // fps debugging 
	        this.game.debug.text(this.game.time.fps, 5, 20);
	        
	        this.game.physics.arcade.collide(ship, asteroids, function(){
	            this.eventsOf.collision.dispatch({ type: 'COLLISION' });
	        }.bind(this));
	        
	        ship.animations.play('idle');
	        
	        if(keys.left.isDown){
	            this.eventsOf.keys.dispatch({ type: 'KEY', key: 'left' });
	        } else if(keys.right.isDown){
	            this.eventsOf.keys.dispatch({ type: 'KEY', key: 'right' });
	        } else {
	            this.eventsOf.keys.dispatch({ type: 'KEY', key: 'no-rotate' });
	        }
	        
	        if(keys.up.isDown){
	            this.eventsOf.keys.dispatch({ type: 'KEY', key: 'up' });
	        } else {
	            this.eventsOf.keys.dispatch({ type: 'KEY', key: 'no-thrust' });
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
	
	function Ship(game, x, y, sprite, props){
	    GameObject.call(this, game, x, y, sprite);
	    this.scale.x *= -1;
	    
	    this.props = props;
	    
	    this.update = function(){
	        // this.body.rotation = this.body.angle * 180 / Math.PI;
	    };
	    
	    this.onEvents = function(event){
	        switch(event.type){
	            case 'KEY': 
	                onKeyPress.call(this, event);
	                break;
	            case 'COLLISION':
	                onCollision.call(this, event);
	        }
	    };
	}
	
	Ship.prototype = Object.create(GameObject.prototype);
	Ship.prototype.constructor = Ship;
	
	// reducers: 
	function onKeyPress(event){
	    switch (event.key) {
	        case 'left':
	            this.body.angularVelocity = -this.props.ROTATION_SPEED;
	            break;
	        case 'right':
	            this.body.angularVelocity = this.props.ROTATION_SPEED;
	            break;
	        case 'no-rotate':
	            this.body.angularVelocity = 0;
	            break;
	        case 'up':
	            this.body.acceleration.x = Math.cos(this.rotation) * this.props.ACCELERATION;
	            this.body.acceleration.y = Math.sin(this.rotation) * this.props.ACCELERATION;
	            break;
	        case 'no-thrust':
	            this.body.acceleration.setTo(0, 0);
	            break;
	    }
	}
	
	function onCollision(event){
	    
	}
	
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
	
	GameObject.prototype.listen = function(eventSource, callback){
	    eventSource.add(callback, this);
	};
	
	GameObject.prototype.onEvents = function(event){
	    console.log('[%s]: ', this.constructor.name, event);
	};
	
	module.exports = GameObject;

/***/ },
/* 4 */
/*!********************************!*\
  !*** ./client/src/asteroid.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	var GameObject = __webpack_require__(/*! ./gameobject.js */ 3);
	
	function Asteroid(game, x, y, sprite){
	    var asteroidSprites = ['01','02','03','04','05','06','07','08'], 
	        aRandomSprite = Math.floor(Math.random() * asteroidSprites.length),
	        aRandomSize = Math.random() * 1;
	    
	    GameObject.call(this, game, x, y, sprite);
	    this.animations.add('idle', [aRandomSprite], 10, true);
	    this.body.bounce.setTo(1, 1);
	    this.scale.x *= aRandomSize;
	    this.scale.y *= aRandomSize;
	    
	    this.update = function(){
	        this.animations.play('idle');
	    };
	}
	
	Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
	Asteroid.prototype.constructor = Asteroid;
	
	module.exports = Asteroid;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map