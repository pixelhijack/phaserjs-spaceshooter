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

	var actionTypes = __webpack_require__(/*! ./actionTypes.js */ 2);
	var Ship = __webpack_require__(/*! ./ship.js */ 3);
	var Asteroid = __webpack_require__(/*! ./asteroid.js */ 6);
	var Bullet = __webpack_require__(/*! ./bullet.js */ 7);
	
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
	                { name: 'IDLE', frames: ['43'], fps: 10, loop: true }    
	            ]
	        });
	        
	        // load those freakin bullets!
	        for(var i = 0; i < ship.props.NUMBER_OF_BULLETS; i++) {
	            var bullet = new Bullet(this.game, 0, 0, 'ships', {
	                animations: [
	                    { 
	                        name: 'IDLE', 
	                        frames: ['44'], 
	                        fps: 10, 
	                        loop: true
	                    }, { 
	                        name: 'EXPLODE', 
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
	        
	        for(var j=0;j<20;j++){
	            var asteroid =  new Asteroid(this.game, Math.random() * this.world.width, Math.random() * this.world.height, 'asteroids', {
	                animations: [
	                    { 
	                        name: 'IDLE', 
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
	        console.log('[PHASER] update');
	        
	        // fps debugging 
	        this.game.debug.text(this.game.time.fps, 5, 20);
	        
	        asteroids.forEachAlive(function(sprite){
	            sprite.debug(sprite.id);
	        });
	        
	        this.game.physics.arcade.collide(ship, asteroids, function(){
	            this.eventsOf.collision.dispatch({ type: actionTypes.COLLISION });
	        }.bind(this));
	        
	        this.game.physics.arcade.collide(ship.bullets, asteroids, function(bullet, asteroid){
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

/***/ },
/* 2 */
/*!***********************************!*\
  !*** ./client/src/actionTypes.js ***!
  \***********************************/
/***/ function(module, exports) {

	var actionTypes = {
	    MOVE: 'MOVE',
	    SHOOT: 'SHOOT',
	    COLLISION: 'COLLISION',
	    HIT: 'HIT'
	};
	
	module.exports = actionTypes;

/***/ },
/* 3 */
/*!****************************!*\
  !*** ./client/src/ship.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	var GameObject = __webpack_require__(/*! ./gameobject.js */ 4);
	
	function Ship(game, x, y, sprite, props){
	    GameObject.call(this, game, x, y, sprite, props);
	    this.setId();
	    this.body.collideWorldBounds = true;
	    this.scale.x *= -1;
	    
	    this.bullets = this.game.add.group();
	    
	    this.shoot = function(){
	
	        if(this.hasState('SHOOT')){
	            return;
	        }
	        
	        this.setState({ 
	            type: 'SHOOT', 
	            priority: 1, 
	            time: this.game.time.now + this.props.SHOT_DELAY 
	        });
	        
	        var bullet = this.bullets.getFirstDead();
	        if(!bullet){ 
	            return; 
	        }
	        bullet.revive();
	        bullet.state = [];
	        bullet.reset(this.x, this.y);
	
	        // Shoot it
	        bullet.rotation = this.rotation;
	        game.physics.arcade.velocityFromRotation(this.rotation, 400, bullet.body.velocity);
	    };
	    
	    this.onEvents = function(event){
	        switch(event.type){
	            case 'MOVE': 
	                onMove.call(this, event);
	                break;
	            case 'SHOOT':
	                onShoot.call(this, event);
	                break;
	            case 'COLLISION':
	                onCollision.call(this, event);
	                break;
	        }
	    };
	}
	
	Ship.prototype = Object.create(GameObject.prototype);
	Ship.prototype.constructor = Ship;
	
	// reducers: 
	function onMove(event){
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
	
	function onShoot(event){
	    this.shoot();
	}
	
	function onCollision(event){
	    
	}
	
	module.exports = Ship;

/***/ },
/* 4 */
/*!**********************************!*\
  !*** ./client/src/gameobject.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var hasId = __webpack_require__(/*! ./mixins/hasId.js */ 5);
	
	function GameObject(game, x, y, sprite, props){
	    
	    this.game = game;
	    this.props = props || { animations: [] };
	    
	    // state object: { type: 'STUN', time: 12077484, priority: 1 }
	    this.state = [];
	    this.DEFAULT_STATE = {
	        type: 'IDLE',
	        time: 0,
	        priority: 0
	    };
	    
	    Phaser.Sprite.call(this, game, x, y, sprite);
	    this.setId();
	    
	    this.props.animations.forEach(function(animation){
	        this.animations.add(animation.name, animation.frames, animation.fps, animation.loop);
	    }.bind(this));
	    
	    this._debugText = this.addChild(this.game.add.text(20, -20, 'debug', { font: "12px Arial", fill: "#ffffff" }));
	    this._debugText.visible = false;
	    
	    this.game.add.existing(this);
	    this.game.physics.enable(this, Phaser.Physics.ARCADE);
	    this.anchor.setTo(0.5, 0.5);
	}
	
	GameObject.prototype = Object.create(Phaser.Sprite.prototype);
	GameObject.prototype.constructor = GameObject;
	
	GameObject.prototype = Object.assign(GameObject.prototype, hasId);
	
	GameObject.prototype.listen = function(eventSource, callback){
	    eventSource.add(callback, this);
	};
	
	GameObject.prototype.onEvents = function(event){
	    console.log('[%s]: ', this.constructor.name, event);
	};
	
	GameObject.prototype.setState = function(state){
	    this.state.push(state);
	};
	
	GameObject.prototype.clearState = function(state){
	    this.state = this.state.filter(function(state){
	        return state.time > this.game.time.now;
	    }.bind(this));
	};
	
	GameObject.prototype.getState = function(){
	    // 1. default if no other
	    // 2. highest priority, pop
	    // 3. longest time-span
	    if(!this.state.length){
	        return this.DEFAULT_STATE;
	    }
	    return this.state[0];
	};
	
	GameObject.prototype.hasState = function(stateToTest){
	    return this.state.some(function(state){
	        return state.type === stateToTest && state.time > this.game.time.now;
	    }.bind(this));
	};
	
	GameObject.prototype.update = function(){
	    if(!this.state){ return; }
	    var state = this.getState();
	    this.animations.play(state.type);
	    this.clearState();
	};
	
	GameObject.prototype.debug = function(toDebug){
	  this._debugText.visible = true;
	  this._debugText.setText(toDebug || '');
	};
	
	module.exports = GameObject;

/***/ },
/* 5 */
/*!************************************!*\
  !*** ./client/src/mixins/hasId.js ***!
  \************************************/
/***/ function(module, exports) {

	var hasId = {
	    setId: function(){
	        this.id = this.constructor.name + '-' +
	            (this.x | 0) + '-' +
	            (this.y | 0) + '-' +
	            Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
	
	    }
	};
	
	module.exports = hasId;

/***/ },
/* 6 */
/*!********************************!*\
  !*** ./client/src/asteroid.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	var GameObject = __webpack_require__(/*! ./gameobject.js */ 4);
	
	function Asteroid(game, x, y, sprite, props){
	    
	    GameObject.call(this, game, x, y, sprite, props);
	    this.setId();
	    this.body.bounce.setTo(1, 1);
	    this.body.collideWorldBounds = true;
	}
	
	Asteroid.prototype = Object.create(GameObject.prototype);
	Asteroid.prototype.constructor = Asteroid;
	
	Asteroid.prototype.onHit = function(event){
	    if(event.type === 'HIT' && event.target === this.id){
	        this.kill();
	    }
	};
	
	module.exports = Asteroid;

/***/ },
/* 7 */
/*!******************************!*\
  !*** ./client/src/bullet.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var GameObject = __webpack_require__(/*! ./gameobject.js */ 4);
	
	function Bullet(game, x, y, sprite, props){
	    
	    GameObject.call(this, game, x, y, sprite, props);
	    this.setId();
	    
	    this.outOfBoundsKill = true;
	    this.checkWorldBounds = true;
	    this.allowRotation = true;
	}
	
	Bullet.prototype = Object.create(GameObject.prototype);
	Bullet.prototype.constructor = Bullet;
	
	Bullet.prototype.explode = function(event){
	    if(event.type === 'HIT'){
	        this.setState({ type: 'EXPLODE', priority: 3, time: this.game.time.now + 100 });
	        this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function(){
	            this.setState({ type: 'DIE', priority: 10, time: this.game.time.now + 300 });
	        }, this);
	    }
	};
	
	module.exports = Bullet;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map