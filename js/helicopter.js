'use strict';

var KEY = {
  'BACKSPACE': 8, 'TAB': 9, 'NUM_PAD_CLEAR': 12, 'ENTER': 13, 'SHIFT': 16,  'CTRL': 17, 'ALT': 18, 'PAUSE': 19, 'CAPS_LOCK': 20, 'ESCAPE': 27,  'SPACEBAR': 32, 'PAGE_UP': 33, 'PAGE_DOWN': 34, 'END': 35, 'HOME': 36,
  'ARROW_LEFT': 37, 'ARROW_UP': 38, 'ARROW_RIGHT': 39, 'ARROW_DOWN': 40,  'PRINT_SCREEN': 44, 'INSERT': 45, 'DELETE': 46, 'SEMICOLON': 59,  'WINDOWS_LEFT': 91, 'WINDOWS_RIGHT': 92, 'SELECT': 93,
  'NUM_PAD_ASTERISK': 106, 'NUM_PAD_PLUS_SIGN': 107,  'NUM_PAD_HYPHEN-MINUS': 109, 'NUM_PAD_FULL_STOP': 110,  'NUM_PAD_SOLIDUS': 111, 'NUM_LOCK': 144, 'SCROLL_LOCK': 145,
  'EQUALS_SIGN': 187, 'COMMA': 188, 'HYPHEN-MINUS': 189,  'FULL_STOP': 190, 'SOLIDUS': 191, 'GRAVE_ACCENT': 192,  'LEFT_SQUARE_BRACKET': 219, 'REVERSE_SOLIDUS': 220,  'RIGHT_SQUARE_BRACKET': 221, 'APOSTROPHE': 222
};

(function () {
  /* 0 - 9 */
  for (var i = 48; i <= 57; i++) {
    KEY['' + (i - 48)] = i;
  }
  /* A - Z */
  for (i = 65; i <= 90; i++) {
    KEY['' + String.fromCharCode(i)] = i;
  }
  /* NUM_PAD_0 - NUM_PAD_9 */
  for (i = 96; i <= 105; i++) {
    KEY['NUM_PAD_' + (i - 96)] = i;
  }
  /* F1 - F12 */
  for (i = 112; i <= 123; i++) {
    KEY['F' + (i - 112 + 1)] = i;
  }
})();

var Heli = {};

Heli.Consts = [{
    name: 'State',
    consts: ['WAITING', 'PAUSED', 'PLAYING', 'DYING']
}, {
    name: 'Dir',
    consts: ['UP', 'DOWN']
}];

Heli.FOOTER_HEIGHT = 20;
Heli.FPS = 19;

Heli.Color = {
    BACKGROUND: '#666666',
    BLOCK: '#04b300',
    HOME_TEXT: '#fff',
    RAND_BLOCK: '#ffffff',
    USER: '#FFFF00',
    TARGET_STROKE: '#B24524',
    DIALOG_TEXT: '#333333',
    FOOTER_BG: '#403B37',
    FOOTER_TEXT: '#C3CCB5',
	HEADER_FONT_SIZE_BIG: '36px',			
	HEADER_FONT_SIZE_SMALL: '20px'
};

Heli.User = function (params) {
    var _distance = 0;
    var position = null;
    var _trail = null;
    var _lives = localStorage.lives != null ? localStorage.lives : 5;
    var momentum = null;

    function finished() {
        if (_distance > bestDistance()) {
            localStorage.bestDistance = _distance;
        }
    }

    function bestDistance() {
        return parseInt(localStorage.bestDistance || 0, 10);
    }

    function distance() {
        return _distance;
    }

    function lives() {
        return _lives;
    }

    function die() {
        _lives -= 1;
        localStorage.setItem('lives', _lives);
		if (_lives == 0) {
			
		}
    }

    function reset() {
        if(lives() < 1) {
			_distance = 0;
			_lives = 5;
		};
        position = 50;
        _trail = [];
        momentum = 0;
    }

    function move(thrusters, carPos) {
        _distance += 1;	
		
        var gravities = ((screen.height - carPos.top) / screen.height + 0.4) * -1;		

        momentum += ((thrusters) ? .5 : gravities);
        position += momentum;

        if (params.tick() % 2 === 0) {
            _trail.push(position);
        }

        if (_trail.length > 4) {
            _trail.shift();
        }

        return position;
    }

    function trail() {
        return _trail;
    }

    return {
        reset: reset,
        move: move,
        trail: trail,
        distance: distance,
        lives: lives,
        die: die,
        finished: finished,
        bestDistance: bestDistance
    };
};

Heli.Screen = function (params) {

    var _width = params.width;
    var _height = params.height;
    var _numLines = 30;
    var _direction = Heli.Dir.UP;
    var _lineWidth = _width / _numLines;
    var _lineHeight = _height / 100;
    var _gap = null;
    var _randomBlock = null;
    var magnitude = null;
    var changeDir = 0;
    var _blockY = null;
    var _blockHeight = 20;
    var heliHeight = (30 / params.height) * 100; // Convert px to %
    var _terrain = [];
    var _trowels = [{}];  

    var car1 = new Image();
    var car2 = new Image();
    var car3 = new Image();
    var car4 = new Image();
    var car5 = new Image();
    var carDead1 = new Image();
    var carDead2 = new Image();
    var carDead3 = new Image();
    var whomping = new Image();
    var img7 = new Image();
    var branch1 = new Image();

    var _carCount = 1;

    var backgroundImg = new Image();
    var backgroundImg2 = new Image();
    var backgroundNight = new Image();
    var midGroundImg = new Image();
    var midGroundImg2 = new Image();

    var trowel1 = new Image();
	var trowel2 = new Image();
	var trowel3 = new Image();
	var trowel4 = new Image();
	var trowel5 = new Image();
	var trowel6 = new Image();
	var trowelpics = [trowel1,trowel2,trowel3,trowel4,trowel5];

    //var TerrainImg1 = new Image();  
    //var TerrainImg2 = new Image();

    var _carPos = {};
    var _buildingsPos = {};
    var _backgroundPos = {};
    var _background2Pos = {};
    var _midGroundPos = {};
    var _midGround2Pos = {};
    var _whompingPos = {};
	var _branch1 = {};

    car1.src = 'style/img/car1.png';
    car2.src = 'style/img/car2.png';
    car3.src = 'style/img/car3.png';
    car4.src = 'style/img/car4.png';
    car5.src = 'style/img/car5.png';

    carDead1.src = 'style/img/cardead1.png';
    carDead2.src = 'style/img/cardead2.png';
    carDead2.src = 'style/img/cardead2.png';
    carDead3.src = 'style/img/cardead3.png';

    img7.src = 'style/img/charmander.png';

    backgroundNight.src = 'style/img/background-night.jpg';
    backgroundImg.src = 'style/img/background.png';
    backgroundImg2.src = 'style/img/background-flip.png';
    midGroundImg.src = 'style/img/midground.png';
    midGroundImg2.src = 'style/img/midground-flip.png';

    //TerrainImg1.src = 'style/img/terrain1.png';
    //TerrainImg2.src = 'style/img/tree1.png';

    whomping.src = 'style/img/whomping.png';
	branch1.src = 'style/img/branch1.png';

    trowel1.src = 'style/img/owlFly1.png';
    trowel2.src = 'style/img/owlFly2.png';
    trowel3.src = 'style/img/owlFly3.png';
    trowel4.src = 'style/img/owlFly4.png';
    trowel5.src = 'style/img/owlFly5.png';	
	trowel6.src = 'style/img/small-trowl.png';
	
	var _trowelCount = 1;

    function width() {
        return _width;
    }

    function height() {
        return _height;
    }

    function carPos() {
        return _carPos;
    }
	
    function backgroundPos() {
        return _background2Pos;
    }	

    function treePos() {
        return _whompingPos;
    }    
	

    function init() {

        magnitude = null;
        changeDir = 0;
        _randomBlock = null;
        _gap = 80;
        _terrain = [];

        _trowels = [{
            'left': width() - 200,
			'right': (width() - 200) + 82,
            'top': 200,
            'speed': 1
        }];

        _carPos = {
            'top': 0,
            'left': 0,
			'angle':80
        };
        //_buildingsPos = {'top':0,'left':0, 'width':200, height:400, 'image':TerrainImg2};
        _whompingPos = {
            'width': 726,
            'height': 500,
            'visible': false,
            left: width() + 600,
            'top': (height() - _whompingPos.height)+60, 
            'right': _whompingPos.left + 581,
			'branch1PosLeft':_whompingPos.left + 681,
			'branch1PosTop':(height() - _whompingPos.height) + 250,
			'branchAngle':0,
			'dir':0,
        };

        _backgroundPos = {
            'left': 0,
            'right': width(),
            'height': height() / 2,
			'top': (height() - _backgroundPos.height) + 50
        };
        _background2Pos = {
            'left': width(),
            'right': width() * 2,
            'height': height() / 2,
			'top': (height() - _backgroundPos.height) + 50,
			'dir':1
        };

        _midGroundPos = {
            'left': 0,
            'right': width(),
            'height': height() / 2,
            'top': (height() - _backgroundPos.height) - 100
        };
        _midGround2Pos = {
            'left': width(),
            'right': width() * 2,
            'height': height() / 2,
            'top': (height() - _backgroundPos.height) - 100
        };

        var size = (100 - _gap) / 2;
        var obj = {
            top: size,
            bottom: size
        };

        //for (var i = 0; i < _numLines; i += 1) {
        //  _terrain.push(obj);
        //}

    }

    function draw(ctx) { //background
        ctx.fillStyle = Heli.Color.BACKGROUND;
        ctx.fillRect(0, 0, _width, _height);
        ctx.fill();
    }

    function toPix(userPos) {
        return _height - (_height * (userPos / 100));
    }

    function randomNum(low, high) {
        return low + Math.floor(Math.random() * (high - low));
    }

    function moveTerrain() {
        var rand;

		if (_trowelCount < 4) { 
			_trowelCount ++;
		} else {
			_trowelCount = 0;
		}		

        if (_backgroundPos.right < 0) {
            _backgroundPos.left = _background2Pos.right;
            _backgroundPos.right = _background2Pos.right * 2;
        }
        if (_background2Pos.right < 1) {
            _background2Pos.left = _backgroundPos.right;
            _background2Pos.right = _backgroundPos.right * 2;
        }

        if (_midGroundPos.right < 1) {
            _midGroundPos.left = _midGround2Pos.right;
            _midGroundPos.right = _midGround2Pos.right * 2;

        }
        if (_midGround2Pos.right < 1) {
            _midGround2Pos.left = _midGroundPos.right;
            _midGround2Pos.right = _midGroundPos.right * 2;
        }

        _backgroundPos.left -= 12;
        _backgroundPos.right -= 12;
        _background2Pos.left -= 12;
        _background2Pos.right -= 12;       
		
		
		if (_background2Pos.dir == 1) {
			if (_background2Pos.top < 550) {
			_background2Pos.top += 1;
			_whompingPos.top += 1;
			}
			else {
				_background2Pos.dir = 2
			}
		}
		else if (_background2Pos.dir == 2) {
			if (_background2Pos.top > 470){
				_background2Pos.top -= 1;
				if (_background2Pos.top > 420){ 
					_whompingPos.top -= 1;
				}
				
			}
			else {
				_background2Pos.dir = 1
			}
		}
		
		
        _midGroundPos.left -= 6;
        _midGroundPos.right -= 6;
        _midGround2Pos.left -= 6;
        _midGround2Pos.right -= 6;
		
		_whompingPos.left -= 17;
        _whompingPos.right -= 17;
		_whompingPos.branch1PosLeft -= 17;
		
		if (_whompingPos.left < -800) {
			_whompingPos.left = width() + 800;
			_whompingPos.right = _whompingPos.left + whomping.width;
		}

		
		if (params.tick() % 2 == 0) {
			if (_whompingPos.dir == 0) {
				_whompingPos.branchAngle ++
				if (_whompingPos.branchAngle > 10) {
					_whompingPos.dir = 1;
				}
			} else {
				_whompingPos.branchAngle --;
				if (_whompingPos.branchAngle < 0) {
					_whompingPos.dir = 0;
				}				
			}					
		}
        for (var i = 0; i < _trowels.length; i += 1) {            
			_trowels[i].left -= 25;            
            if (_trowels[i].left < -1) {
                _trowels.splice(i, 1);
            }
        }
    }

    function drawTerrain(ctx, user) {

        ctx.drawImage(backgroundNight, 0, 0, (1881 < width()) ? width() : 1881, 593);
        ctx.drawImage(midGroundImg, _midGroundPos.left, _midGroundPos.top, width(), _backgroundPos.height);
        ctx.drawImage(midGroundImg2, _midGround2Pos.left, _midGroundPos.top, width(), _backgroundPos.height);
        ctx.drawImage(backgroundImg, _backgroundPos.left, _background2Pos.top, width(), _backgroundPos.height);
        ctx.drawImage(backgroundImg2, _background2Pos.left, _background2Pos.top, width(), _backgroundPos.height);

        if (user.distance() > 30 && _whompingPos.visible == false) {
            _whompingPos.visible == true;
            ctx.drawImage(whomping, _whompingPos.left, _whompingPos.top, _whompingPos.width, _whompingPos.height);			
			//var wigglingBranch = rotateAndCache(branch1,_whompingPos.branchAngle)					
			//ctx.drawImage(wigglingBranch, _whompingPos.branch1PosLeft, _whompingPos.branch1PosTop, 200, 200);
        }

        for (var i = 0; i < _trowels.length; i += 1) {
			if (i==3) {
				ctx.drawImage(trowel6, _trowels[i].left, _trowels[i].top, 100, 100);					
			}
			else {
				ctx.drawImage(trowelpics[_trowelCount], _trowels[i].left, _trowels[i].top, 100, 100);					
			}
        }		
		
        if (params.tick() % 25 == 0) {
            if (_trowels.length < 4) {
                var randy = randomNum(1, 3) * 100;
                _trowels.push({
                    'left': width() - 200,
                    'top': randy,
                    'speed': 1
                });
            }
        }
    }


    function rotateAndCache (image, angle) {
        var offscreenCanvas = document.createElement('canvas');
        var offscreenCtx = offscreenCanvas.getContext('2d');
        var size = Math.max(image.width, image.height);
        offscreenCanvas.width = size;
        offscreenCanvas.height = size;
        offscreenCtx.translate(size / 2, size / 2);
        offscreenCtx.rotate(angle + Math.PI / 2);
        offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
        return offscreenCanvas;
    }
	

    function drawUser(ctx, user, trail, alternate, state) {

        if (_carCount - 5) {
            _carCount++
        } else {
            _carCount = 1;
        };

        var i, len, mid, image;

        mid = Math.round(_terrain.length * 0.25);
        image = _carCount == 1 ? car1 : _carCount == 2 ? car2 : _carCount == 3 ? car3 : _carCount == 4 ? car4 : car5;

        if (alternate == false) { //car has crashed
            image = carDead1;
            if (state == undefined) {
                image = carDead2;
            }
        }

        if (state == 3) { //car is deaded
            image = carDead3
        }

        ctx.fillStyle = Heli.Color.USER;

        ctx.beginPath();
        var topPos = (toPix(user) - (heliHeight / 2));
        _carPos.top = topPos;
        _carPos.bottom = topPos + 78;
        _carPos.left = 238;
        _carPos.right = _carPos.left + 278;
		
        //image = rotateAndCache(image, _carPos.angle)		
        ctx.drawImage(image, _carPos.left, topPos);

        ctx.fill();
        ctx.closePath();
        ctx.closePath();
    }

    function collided(pos, user) {
        //var midPoint = Math.round(_terrain.length * 0.25);
        //var middle = _terrain[midPoint];
        //var size = heliHeight + 5;
        
		if (pos < 1 || pos > 105) {
            user.die();
			console.log("too hi.lo");
            return true;
        }
		if (_carPos.bottom > (_background2Pos.top)+140) {
			console.log("crashed inna forest init");
			user.die();
             return true;
		}
		
        if ((_whompingPos.left < _carPos.right) && (_carPos.bottom > _whompingPos.top)) {
            if (_whompingPos.right > _carPos.left) {
                console.log("crashed inna tree yo - your carse was at: bottom " + _carPos.bottom + " right " + _carPos.right + " tree : top " + _whompingPos.top + " left " + _whompingPos.left);
				user.die();
                return true;
            }
        }
			
		/*if (_trowels.length) {								
			for (var i = 0; i < _trowels.length; i++) {				
				
				if(_trowels[i].left < _carPos.right) {
					if (_trowels[i].right > _carPos.left) {
					//console.log("bingo Trowel " + i);
				}
			}
		}
		}*/
        return false;
    }


    function drawTarget(ctx, pos, amount) {
        var mid = Math.round(_terrain.length * 0.25);

        ctx.strokeStyle = Heli.Color.TARGET_STROKE;
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.arc((mid * _lineWidth) - 10, toPix(pos) + 10, 50 - amount, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.closePath();
    }

    return {
        draw: draw,
        drawUser: drawUser,
        drawTerrain: drawTerrain,
        moveTerrain: moveTerrain,
        drawTarget: drawTarget,
        toPix: toPix,
        init: init,
        width: width,
        height: height,
        collided: collided,
        carPos: carPos,
		backgroundPos:backgroundPos,
        treePos: treePos
    };
};

Heli.Audio = function (game) {

    var files = [];
    var endEvents = [];
    var progressEvents = [];
    var playing = [];

    function load(name, path, cb) {

        var f = files[name] = document.createElement('audio');

        progressEvents[name] = function (event) {
            progress(event, name, cb);
        };

        f.addEventListener('canplaythrough', progressEvents[name], true);
        f.setAttribute('preload', 'auto');
        f.setAttribute('autobuffer', 'true');
        f.setAttribute('src', path);
        f.pause();
    }

    function progress(event, name, callback) {
        if (event.loaded === event.total && typeof callback === 'function') {
            callback();
            files[name].removeEventListener('canplaythrough', progressEvents[name], true);
        }
    }

    function disableSound() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].pause();
            files[playing[i]].currentTime = 0;
        }
        playing = [];
    }

    function stop(file) {
        files[file].pause();
        files[file].currentTime = 0;
    }

    function ended(name) {

        var i, tmp = [],
            found = false;

        files[name].removeEventListener('ended', endEvents[name], true);

        for (i = 0; i < playing.length; i++) {
            if (!found && playing[i]) {
                found = true;
            } else {
                tmp.push(playing[i]);
            }
        }
        playing = tmp;
    }

    function play(name) {
        if (!game.soundDisabled()) {
            endEvents[name] = function () {
                ended(name);
            };
            playing.push(name);
            files[name].addEventListener('ended', endEvents[name], true);
            files[name].play();
        }
    }

    function pause() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].pause();
        }
    }

    function resume() {
        for (var i = 0; i < playing.length; i++) {
            files[playing[i]].play();
        }
    }

    return {
        disableSound: disableSound,
        load: load,
        play: play,
        stop: stop,
        pause: pause,
        resume: resume
    };
};

var HELICOPTER = (function () {

    /* Generate Constants from Heli.Consts arrays */ 
    (function (glob, consts) {
        for (var x, i = 0; i < consts.length; i += 1) {
            glob[consts[i].name] = {};
            for (x = 0; x < consts[i].consts.length; x += 1) {
                glob[consts[i].name][consts[i].consts[x]] = x;
            }
        }
    })(Heli, Heli.Consts);

    var state = Heli.State.WAITING;
    var thrustersOn = false;
    var timer = null;
    var audio = null;
    var screen = null;
    var user = null;
    var pos = 0;
    var died = 0;
    var _tick = 0;
    var _carCount = 0;
    var ctx;

    function keyDown(e) {

        if (e.keyCode === KEY.ENTER) {
            audio.play('start');
            thrustersOn = true;
        }

        if (e.keyCode === KEY.S) {
            localStorage.soundDisabled = !soundDisabled();
        } else if (state === Heli.State.WAITING && e.keyCode === KEY.ENTER) {
            newGame();
        } else if (state === Heli.State.PLAYING && e.keyCode === KEY.P) {
            state = Heli.State.PAUSED;
            window.clearInterval(timer);
            timer = null;
            dialog('Paused');
        } else if (state === Heli.State.PAUSED && e.keyCode === KEY.P) {
            state = Heli.State.PLAYING;
            timer = window.setInterval(mainLoop, 1000 / Heli.FPS);
        }
    }

    function keyUp(e) {
        if (e.keyCode === KEY.ENTER) {
            audio.stop('start');
            thrustersOn = false;
        }
    }

    function mouseDown(e) {
        audio.play('start');
        thrustersOn = true;
        if (e.target.nodeName === 'CANVAS' && state === Heli.State.WAITING) {
            newGame();
        }		
    }

    function mouseUp(e) {
        audio.stop('start');
        thrustersOn = false;
    }

    function tick() {
        return _tick;
    }

    function newGame() {
        if (state != Heli.State.PLAYING) {
            user.reset();
            screen.init();
            timer = window.setInterval(mainLoop, 1000 / Heli.FPS);
            state = Heli.State.PLAYING;
        }
    }

    function dialog(text, x, y) {
        var textWidth = ctx.measureText(text).width;
        var x = x || (screen.width() - textWidth) / 2;
        var y = y || (screen.height() / 2) - 7;
        ctx.fillText(text, x, y);
    }

    function soundDisabled() {
        return localStorage.soundDisabled === 'true';
    }
	

    function mainLoop() {
        ++_tick;

        if (state === Heli.State.PLAYING) {
            pos = user.move(thrustersOn,screen.carPos());
            screen.moveTerrain();
            screen.draw(ctx);
            screen.drawTerrain(ctx, user);

            var tmp = screen.collided(pos, user);

            if (tmp !== false) {
                if (tmp !== true) {
                    pos = tmp;
                }
                audio.play('crash');
                state = Heli.State.DYING;
                died = _tick;
                user.finished();
            }

            screen.drawUser(ctx, pos, user.trail(), true, state);
            ctx.font = '32px silkscreen';
            var text1 = user.distance() > 500 ? "WOAH. OVER 500. BURN THE WITCH!" : "FLEE, FLEE THE FOREST AND ITS DARK EMBRACE";
            
			var text2 = "DISTANCE: " + user.distance();
            var text3 = "LIVES: " + user.lives();
            var text4 = "ALTITUDINAL BONUS (RELEVANT)!"
            var carposTop = Math.floor(screen.carPos().bottom);
            var carposRight = Math.floor(screen.carPos().right);
            var treePosTop = Math.floor(screen.treePos().top);
            var treePosRight = Math.floor(screen.treePos().left);

            var textWidth = function (text) {
                return ctx.measureText(text).width;
            };

            var x = (screen.width() - textWidth(text1)) / 2;
            var y = screen.height() / 3;
			var flippingCrap = Math.floor(screen.carPos().top / 100);
            ctx.fillText(text1, x, 180);            
			ctx.fillStyle = "#ffffff";
			ctx.font = '40px silkscreen';
            ctx.fillText(text2, 50, 50);
            ctx.fillText(text3, screen.width() - 250, 50);
			if (flippingCrap < 3) {
				ctx.fillText(text4, (screen.width()-textWidth(text4))/2, 100);
			}
            //ctx.fillText('ALTITUDES ' + flippingCrap, 50, 400);
            //ctx.fillText('TREE POS ' + treePosTop + " " + treePosRight, 50, 450);
        } 
		else if (state === Heli.State.DYING && (_tick > (died + 7))) {
            var textWidth = function (text) {
                return (screen.width() - ctx.measureText(text).width) / 2				
            };
			
            console.log(screen.width());
			ctx.font = '32px silkscreen';			
			ctx.fillStyle = "#ffffff";		
			var dist = "DISTANCE: " + user.distance();
            var lives = "LIVES: " + user.lives();
            ctx.fillText(dist, 50, 50);
            ctx.fillText(lives, screen.width() - 250, 50);
			
			var text1 = "YOU HAVE DIED. YOUR LOVED ONES WILL NOT BE INFORMED."
			var text1a = "THE ETERNAL BLACK ABYSS OF"; 
			var text1b = " NOTHINGNESS IS YOUR ONLY FRIEND NOW";
					
            var text2 = "DISTANCE:";
            var text2a = user.distance();
			var text3 = "BESTEST DISTANCE:";
			var text3a = localStorage.bestDistance;

            var y = screen.height() / 2;
			ctx.fillStyle = "yellow";		
            ctx.fillText(text1, textWidth(text1), 180);
			ctx.font = '36px silkscreen';			
			ctx.fillText(text1a, textWidth(text1a), 240);
			ctx.fillText(text1b, textWidth(text1b), 280);
			
            ctx.fillStyle = "#ffffff";		
			ctx.font = '36px silkscreen';			
			ctx.fillText(text2, textWidth(text2) - 60, 350);
			ctx.fillStyle = "yellow";		
			ctx.fillText(text2a, textWidth(text2) + 190, 350);
			ctx.fillStyle = "#ffffff";		
			ctx.fillText(text3, textWidth(text3)-80, 400);
			ctx.fillStyle = "yellow";		
			ctx.fillText(text3a, textWidth(text3a) + 220, 400);
			ctx.font = '66px silkscreen';			
			if (user.distance() >= localStorage.bestDistance) {
				ctx.fillText(":)", textWidth(":)"), 500);
			} 			else {
				ctx.fillText(":(", textWidth(":)"), 500);
			}
			
			ctx.font = '30px silkscreen';	
			if (user.lives() < 1) {
				var deaded = "YOU HAVE NO LIVES LEFT. YOU WERE LUCKY TO GET THIS FAR.";
				var deaded2 = "BE ALONE WITH YOUR THOUGHTS FOREVER";
				ctx.fillText(deaded, textWidth(deaded), 550);
				ctx.font = '26px silkscreen';		
				ctx.fillText(deaded2, textWidth(deaded2), 650);
			}
			
			
            state = Heli.State.WAITING;
            window.clearInterval(timer);
            timer = null;

        } else if (state === Heli.State.DYING) {
            //if (screen.carPos().bottom < screen.backgroundPos().top + 130) {
				pos -= 4;
			//}		
            screen.draw(ctx);
            screen.drawTerrain(ctx, user);
            screen.drawUser(ctx, pos, user.trail(), false);
            //screen.drawTarget(ctx, pos, _tick - died);//draw circle of DEATH
        }
    }


    function drawScore() {
        ctx.font = '16px silkscreen';
        var recordText = 'Best: ' + user.bestDistance() + 'm';
        var distText = 'Distance: ' + user.distance() + 'm';
        var textWidth = ctx.measureText(recordText).width;
        var textX = screen.height() + 15;
        ctx.fillStyle = Heli.Color.FOOTER_BG;
        ctx.fillRect(0, screen.height(), screen.width(), Heli.FOOTER_HEIGHT);
        ctx.fillStyle = Heli.Color.FOOTER_TEXT;
        ctx.fillText(distText, 5, textX);
        ctx.fillText(recordText, screen.width() - (textWidth + 5), textX);
    }

	
    function init(wrapper, root) {
		
        var width = wrapper.offsetWidth;
        var height = wrapper.offsetHeight;
        var canvas = document.createElement('canvas');

        canvas.setAttribute('width', width + 'px');
        canvas.setAttribute('height', height + 'px');

        wrapper.appendChild(canvas);

        ctx = canvas.getContext('2d');

        audio = new Heli.Audio({
            soundDisabled: soundDisabled
        });

        screen = new Heli.Screen({
            tick: tick,
            width: width,
            height: height
        });

        user = new Heli.User({
            "tick": tick
        });

        screen.init();
        screen.draw(ctx);
        dialog("Loading ...");
        // disable sound while it sucks
        
		if (typeof localStorage.soundDisabled === 'undefined') {
            localStorage.soundDisabled = true;
        }

        var audio_files = [
            ['start', root + 'motor.ogg'],
            ['crash', root + 'crash.ogg']
        ];

        load(audio_files, function () {
            loaded();
        });
    }

    function load(arr, loaded) {
        if (arr.length === 0) {
            loaded();
        } else {
            var x = arr.pop();
            audio.load(x[0], x[1], function () {
                load(arr, loaded);
            });
        }
    }

    function startScreen() {
        screen.draw(ctx);
        screen.drawTerrain(ctx, user);
        ctx.fillStyle = Heli.Color.HOME_TEXT;
        ctx.font = '64px silkscreenbold';
        var text = 'RACE TO HOGWARTS';
        var textWidth = ctx.measureText(text).width;
        var x = (screen.width() - textWidth) / 2;
        var y = screen.height() / 3;        
        ctx.fillText(text, x, y);
        var t = 'Click and hold enter key or Mouse Button';
        var t1 = 'to go up, release to go down.';
        var t2 = 'TOP SCORE: ' +localStorage.bestDistance || "0"
        //var t3 = localStorage.bestDistance || "0";
        var t4 = 'PLAYER 1'
        ctx.font = '16px silkscreen';
        ctx.fillText(t, x + 5, y + 30);
        ctx.fillText(t1, x + 5, y + 43);
        ctx.fillText('press enter or click mouse to start', x + 5, y + 66);
        ctx.font = '40px silkscreenbold';
        ctx.fillStyle = "yellow";
		ctx.fillText(t2, (screen.width() - ctx.measureText(text).width)+30, 50);
        //ctx.fillText(t3, screen.width() - 200, 50);
        ctx.fillText(t4, 50, 50);
    }

    function loaded() {
        document.addEventListener('keydown', keyDown, true);
        document.addEventListener('keyup', keyUp, true);
        document.addEventListener('mousedown', mouseDown, true);
        document.addEventListener('mouseup', mouseUp, true);
		
        startScreen();
    }

    return {
        init: init,
		startScreen: startScreen
    };
}());