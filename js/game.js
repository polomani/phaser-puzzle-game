
var BSIZE = 50;
var Puzzle = Puzzle || {};
Puzzle.Game = function(){};
var game;

Puzzle.Game.prototype.preload = function () {
	this.time.advancedTiming = true;
	this.time.desiredFps = 30;
	this.game.renderer.renderSession.roundPixels = true;
	this.game.stage.smoothed = false;
	game = this.game;

	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
};

Puzzle.Game.prototype.create = function () {
	console.log(Dimensions.getSize());
	console.log(game.width + "x" + game.height);
	game.gameOverFlag = false;
	game.levelWidth = LEVELS[Game.aimLVL][0].length;
	game.levelHeight = LEVELS[Game.aimLVL].length;
	game.levelArr = LEVELS[Game.aimLVL];
	BSIZE = Math.floor (Math.min(Math.max(game.width, game.height) / Math.max(game.levelWidth, game.levelHeight),
		Math.min(game.width, game.height) / Math.min(game.levelWidth, game.levelHeight)));

	game.scale.prevWidth = game.scale.prevHeight = false;
	game.invert = (game.levelHeight > game.levelWidth) && (game.width > game.height) || (game.levelHeight < game.levelWidth) && (game.width < game.height);
	game.solution = "";
	Tutorial.clean();
	Puzzle.Game.prototype.createStage();
	onGameResized();

	this.addMenu();
};

onGameResized =  function (full) {
	BSIZE = Math.floor (Math.min(Math.max(game.width, game.height) / Math.max(game.levelWidth, game.levelHeight),
		Math.min(game.width, game.height) / Math.min(game.levelWidth, game.levelHeight)));
	BSIZE = Math.min(Math.min (Dimensions.getBoxSize(), BSIZE), Dimensions.getMinDimension()/8);
	if (game.boxes)
		game.boxes.forEach (resize);
	function resize (box) {
		var newscale = BSIZE/Dimensions.getBoxSize();
		box.scale.setTo (newscale, newscale);

		var xx = Math.floor ((game.width - game.levelWidth*BSIZE)/2) + box.indexX*BSIZE + BSIZE/2;
		var yy = Math.floor ((game.height - game.levelHeight*BSIZE)/2) + box.indexY*BSIZE + BSIZE/2;

		game.invert = (game.levelHeight > game.levelWidth) && (game.width > game.height) || (game.levelHeight < game.levelWidth) && (game.width < game.height);

		if (game.invert) {
			xx =  game.width - Math.floor ((game.width - game.levelHeight*BSIZE)/2) - box.indexY*BSIZE - BSIZE/2;
			yy =  Math.floor ((game.height - game.levelWidth*BSIZE)/2) + box.indexX*BSIZE + BSIZE/2;
		}

		box.x = xx;
		box.y = yy; 
	}
	Puzzle.Game.rotateArrows();
	Tutorial.resize({bbounds:game.boxes.getLocalBounds()});
}

Puzzle.Game.prototype.addMenu = function () {

	var pause = this.game.add.sprite (0,0, Dimensions.getImageKey("btn_pause"));
    pause.inputEnabled = true;
    pause.scale.setTo(Math.min(1, Dimensions.getMinDimension()/11/pause.width));
    pause.events.onInputDown.add(function () {
      if (!(Popup.anyWinOpened())) {
      		Popup.openOptMenu();
      	}
    });

    var props = this.game.add.sprite (this.game.width,0, Dimensions.getImageKey("btn_props"));
    props.anchor.setTo(1, 0);
    props.scale.setTo(Math.min(1, Dimensions.getMinDimension()/11/props.width));
    props.inputEnabled = true;
    props.events.onInputDown.add(function () {
      if (!(Popup.anyWinOpened())) {
      		Popup.openPropsMenu();
      	}
    });

    if (Game.aimLVL > 6) {
	    var replay = this.game.add.sprite (this.game.width,this.game.height, Dimensions.getImageKey("btn_replay"));
	    replay.anchor.setTo(1, 1);
	    replay.scale.setTo(Math.min(1, Dimensions.getMinDimension()/11/replay.width));
	    replay.inputEnabled = true;
	    replay.events.onInputDown.add(function () {
	      if (!(Popup.anyWinOpened())) {
	      		this.game.state.start("Game");
	      	}
	    });
	}

	if (false && game.device.desktop) {
		var editor_label = game.add.text(0 , 50, 'F1 - Editor', { font: '24px Arial', fill: '#FFFFFF' });
		editor_label.inputEnabled = true;
		editor_label.events.onInputDown.add(function () {
			this.game.state.start('Editor');
		});
	}
}

Puzzle.Game.prototype.createStage = function () {
	game.moving = false;
	game.world.setBounds(0, 0, 2880, 2880);
	game.boxes = game.add.group();

	game.keyUP = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	game.keyDOWN = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	game.keyLEFT = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	game.keyRIGHT = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	game.keyF1 = game.input.keyboard.addKey(Phaser.Keyboard.F1);
	game.keyUP.onDown.add(step, this);
	game.keyDOWN.onDown.add(step, this);
	game.keyLEFT.onDown.add(step, this);
	game.keyRIGHT.onDown.add(step, this);
	game.keyF1.onDown.add(function () {
		this.game.state.start('Editor');
	});

	game.matrix = [];
	game.blueBoxes = [];
	game.doors = [];
	game.ports = [];
	game.robots = [];
	game.arrows = [];
	game.gaps = [];
	var arr = game.levelArr;
	for (var y = 0; y < arr.length; y++) {
		game.matrix[y]=[];
		for (var x = 0; x < arr[y].length; x++) {
			if (arr[y]) 
			{
				if(arr[y][x]==0 && !arr[y][x]) {
					game.matrix[y][x] = undefined;
					continue;
				}
				var box;
				var xx = 0, yy = 0;
				if(arr[y][x]==1) box = game.boxes.create (xx, yy, Dimensions.getImageKey('box_black'));
				if(isBlueBox(arr[y][x])) box = game.boxes.create (xx, yy, Dimensions.getImageKey('box_blue_'+getBlueBoxColor(arr[y][x])));
				if(arr[y][x]==3) box = game.boxes.create (xx, yy, Dimensions.getImageKey('box_gap'));
				if(arr[y][x]==8) box = game.boxes.create (xx, yy, Dimensions.getImageKey('box_sokoban'));
				if (arr[y][x] instanceof Object) {
					if (arr[y][x].value == 4) {
						box = game.boxes.create(xx, yy, 'box_door');
						box.frame = arr[y][x].state;
					}
					if (arr[y][x].value == 5) {
						box = game.boxes.create(xx, yy, Dimensions.getImageKey('box_arr'));
						box.angle = o_getAngleFromDir(arr[y][x].dir);
						box.dir = arr[y][x].dir;
						if (arr[y][x].spin) 
						{
							box.frame = (arr[y][x].spin=="cw") ? 1 : 2;
						}
					}
					if (arr[y][x].value == 6) {
						box = game.boxes.create(xx, yy, 'box_port');
						box.frame = arr[y][x].id;
					}
					if (arr[y][x].value == 7) {
						box = game.boxes.create(xx, yy, 'box_red');
					}
				}
				if (arr[y][x]==0 || arr[y][x]==3 || arr[y][x] instanceof Object) game.boxes.setChildIndex(box, 0);
				box.anchor.setTo(0.5, 0.5);
				box.indexX = x;
				box.indexY = y;
				game.matrix[y][x] = {
					x:x,
					y:y,
					type:arr[y][x],
					box:box
				};
				if (is (box,"box_blue") || is (box,"box_sokoban")) 
					game.blueBoxes.push (game.matrix[y][x]);
				else if (is (box,"box_door"))
					game.doors.push (game.matrix[y][x]);
				else if (is (box,"box_port"))
					game.ports.push (game.matrix[y][x]);
				else if (is (box,"box_red"))
					game.robots.push (game.matrix[y][x]);
				else if (is (box,"box_arr"))
					game.arrows.push (game.matrix[y][x]);
				else if (is (box,"box_gap"))
					game.gaps.push (game.matrix[y][x]);

				function is (box, key) {
					if (box.key.lastIndexOf(key)!=-1) {
						return true;
					}
					return false;
				}
			}
		}
	}
	game.inputEnabled = true;
	game.input.onDown.addOnce(beginSwipe, game);
	Tutorial.open(Game.aimLVL);
	onGameResized();

	game.matrix.move=function(x, y, side, toRemove, onSpikes) {
		var temp = game.matrix[y][x];
		game.matrix.del(x, y);
		switch (side) {
			case Phaser.LEFT:
				--x;
			break;
			case Phaser.RIGHT:
				++x;
			break;
			case Phaser.UP:
				--y;
			break;
			case Phaser.DOWN:
				++y;
			break;
		}
		var prev = (game.matrix[y][x] && game.matrix[y][x].box) ? game.matrix[y][x] : false;
		game.matrix[y][x] = temp;
		game.matrix[y][x].prev = prev;

		if (game.matrix[y][x].box.teleported)
			game.matrix[y][x].box.teleported = false;

		game.matrix[y][x].y=y;
		game.matrix[y][x].x=x;
		game.matrix[y][x].box.indexX = x;
		game.matrix[y][x].box.indexY = y;
		setBoxPosition(game.matrix[y][x], {toRemove:toRemove, onSpikes:onSpikes});
	};

	game.matrix.next = function (side, x, y, line) {
		if (x == undefined) {
			switch (side) {
				case Phaser.LEFT:
					x = game.matrix[0].length-1;
					y = 0;
				break;
				case Phaser.RIGHT:
					x = 0;
					y = 0;
				break;
				case Phaser.UP:
					x = 0;
					y = game.matrix.length-1;
				break;
				case Phaser.DOWN:
					x = 0;
					y = 0;
				break;
			}
		}
		switch (side) {
			case Phaser.LEFT:
				--x;
				if (x < 0) {
					if (line) {
						return false;
					}
					++y;
					x = game.matrix[0].length-1;
				}
				if (y >= game.matrix.length)
					return false;
			break;
			case Phaser.RIGHT:
				++x;
				if (x >= game.matrix[0].length) {
					if (line) {
						return false;
					}
					++y;
					x = 0;
				}
				if (y >= game.matrix.length)
					return false;
			break;
			case Phaser.UP:
				--y;
				if (y < 0) {
					if (line) {
						return false;
					}
					++x;
					y = game.matrix.length-1;
				}
				if (x >= game.matrix[0].length)
					return false;
			break;
			case Phaser.DOWN:
				++y;
				if (y >= game.matrix.length) {
					if (line) {
						return false;
					}
					++x;
					y = 0;
				}
				if (x >= game.matrix[0].length)
					return false;
			break;
		}
		
		return game.matrix[y][x];
	};

	game.matrix.isBlocked = function (side, x, y) {
		var elem = {x:x, y:y};
		var isBlocked = false;
		while ((elem = this.next(side, elem.x, elem.y, true))) {
			if(!elem || !elem.box || elem.type==3 ||
				(elem.type.value==4 && elem.box.frame==0) ||
				(elem.type.value==5 && game.canGoOnDirection(elem.box.dir, side)) ||
				 elem.type.value==6) {
				break;
			}
			isBlocked = true;
			break;
		}
		if (game.matrix[y][x] && game.matrix[y][x].prev && game.matrix[y][x].prev.type)
			if (game.matrix[y][x].prev.type.value==5 && !game.canGoFromDirection(game.matrix[y][x].prev.box.dir, side))
				isBlocked = true;

		if (game.matrix[y][x] && game.matrix[y][x].box && game.matrix[y][x].type==8)
			isBlocked = isBlocked || this.isSokoBlocked(side, x, y);

		return isBlocked;
	}

	game.matrix.isSokoBlocked = function (side, x, y) {
		var elem = {x:x, y:y};
		while ((elem = this.next(opp(side), elem.x, elem.y, true))) {
			if(elem && elem.box) {
				if (elem.type==8)
					continue;
				if (isBlueBox(elem.type))
					return false;
			}
			break;
		}
		return true;
	}

	function isSameBlueBox(b1, b2) {
		if (isBlueBox(b1) && isBlueBox(b2)) {
			return b1==b2;
		}
		return false;
	}

	game.matrix.moveAll=function(side){
		game.solution += side;
		game.blueBoxes.sort(game.matrix.sortFunction(side));
		var deleted = false;
		for (var i = 0; i < game.blueBoxes.length; ++i) {
			var cur = game.blueBoxes[i];
			var next = this.next(side, cur.x, cur.y);
			if (!this.isBlocked(side, cur.x, cur.y)) {
				if (next && next.type==3) {
					this.move(cur.x, cur.y, side, null, cur.box);
				} else {
					this.move(cur.x, cur.y, side);
				}
			} else {
				if (next && isSameBlueBox(next.type, cur.type) && !(next.prev && next.prev.type.value==5 && !game.canGoOnDirection(next.prev.box.dir, side))) {
					if (((!cur.prev || cur.prev.type.value!=5) || game.canGoFromDirection(cur.prev.box.dir, side)) && this.isBlocked(side, next.x, next.y)) {				
						game.blueBoxes[game.blueBoxes.indexOf(next)]="deleted";
						game.matrix.del(next.x, next.y);
						this.move(cur.x, cur.y, side, next.box);
						deleted=true;
					}
				}
			}
		}
		while (deleted && game.blueBoxes.indexOf("deleted")!=-1)
			game.blueBoxes.splice(game.blueBoxes.indexOf("deleted"), 1);

		// for (var y = 0; y < arr.length; y++) {
		// 	var s = "";
		// 	for (var x = 0; x < arr[y].length; x++) {
		// 		if (game.matrix[y][x]) 
		// 			s+=game.matrix[y][x].type + ' ';
		// 		else
		// 			s+='  ';
		// 	}
		// 	console.log(s);
		//}
	}

	game.matrix.sortFunction = function (side) {
		switch (side) {
			case Phaser.LEFT:
				return game.matrix.sortFunctionLeft;
			case Phaser.RIGHT:
				return game.matrix.sortFunctionRight;
			case Phaser.UP:
				return game.matrix.sortFunctionUp;
			case Phaser.DOWN:
				return game.matrix.sortFunctionDown;
		}
	}
	game.matrix.sortFunctionUp=function(a, b) {
		var c = a.x-b.x;
		if (c==0)
			c =  a.y-b.y;
		return c;
	}
	game.matrix.sortFunctionDown=function(a, b) {
		var c = a.x-b.x;
		if (c==0)
			c = b.y-a.y;
		return c;
	}
	game.matrix.sortFunctionLeft=function(a, b) {
		var c = a.y-b.y;
		if (c==0)
			c = a.x-b.x;
		return c;
	}
	game.matrix.sortFunctionRight=function(a, b) {
		var c = a.y-b.y;
		if (c==0)
			c = b.x-a.x;
		return c;
	}

	game.matrix.del=function(x, y){
		if (game.matrix[y][x].prev) {
			game.matrix[y][x] = game.matrix[y][x].prev;
		} else {
			game.matrix[y][x] = undefined;
		}
	};

	game.matrix.left=function(){
		this.moveAll(Phaser.LEFT);
	};

	game.matrix.right=function(){
		this.moveAll(Phaser.RIGHT);
	};

	game.matrix.up=function(){
		this.moveAll(Phaser.UP);
	};

	game.matrix.down=function(){
		this.moveAll(Phaser.DOWN);
	};

	game.isAnyBoxOnGap = function () {
		var res = false;
		game.blueBoxes.forEach (function(box1) {
			if (isBlueBox(box1.type)) {
				game.gaps.forEach (function(box2) {
					if(box1.box.indexX==box2.box.indexX && box1.box.indexY==box2.box.indexY) {
						res=true;
					}
				});
			}
		});
		return res;
	}

	game.checkGameOver = function (params) {
		if (!game.isAnyBoxOnGap() && game.countBlueBoxes()==1 && !Popup.gameWinWin) {
			game.gameOverFlag = true;
			Popup.openWinMenu();
			saveSolutionToFirebase();
			Data.setCompletedLevels(Game.aimLVL+1);
		}
		if (params && params.onSpikes && !Popup.gameOverWin) {
			Popup.openGameOverMenu();
		}
	}

	game.countBlueBoxes = function() {
		var q1 = 0;
		var q2 = 0;
		var q3 = 0;
		game.blueBoxes.forEach (function(box) {
			if (isBlueBox(box.type)) {
				if (box.type==2 || box.type==20) q1++;
				if (box.type==21) q2++;
				if (box.type==22) q3++;
			}
		});
		return Math.max(q1, Math.max(q2, q3));
	}

	game.updateDoors = function () {
		game.doors.forEach(function(box){
			box.box.frame=(box.box.frame+1)%2;
		});
	}

	game.canGoFromDirection = function (dirArr, dir) {
		if (dirArr==dir)
			return true;
		return false;
	}

	game.canGoOnDirection = function (dirArr, dir) {
		if (opp(dirArr)==dir)
			return false;
		return true;
	}

	game.checkTeleport = function (x, y) {
		if (game.matrix[y][x].prev && game.matrix[y][x].prev.type.value==6) {
			if (!game.matrix[y][x].box.teleported) {	
				var elem = this.findTeleport(x, y);
				if (elem) {
					game.matrix[y][x].box.teleported = true;
					var tempSecondTeleport = game.matrix[elem.y][elem.x];
					game.matrix[elem.y][elem.x] = game.matrix[y][x];
					game.matrix[y][x] = game.matrix[y][x].prev;
					game.matrix[elem.y][elem.x].prev = tempSecondTeleport;
					game.matrix[elem.y][elem.x].x = elem.x;
					game.matrix[elem.y][elem.x].y = elem.y;
					setBoxPosition (game.matrix[elem.y][elem.x], {port:true, portX:x, portY:y});
				}
			} 
		}
	}

	game.findTeleport = function (x, y) {
		var box = game.matrix[y][x].prev;
		var res;
		game.ports.forEach (function(elem){
			if (box.type.id==elem.type.id && box!=elem)
				if(game.matrix[elem.y][elem.x]==elem)
					res =  elem;
		});
		return res;
	}

	game.moveRobots = function () {
		game.robots.forEach (function(elem){
			if (!elem.path && !elem.nocycle) {
				if (elem.startX) {
					elem.startX = elem.indexX;
					elem.startY = elem.indexY;
				} else {
					elem.nocycle = !(elem.startX==elem.indexX && elem.startY==elem.indexY);
				}
				elem.path = elem.type.path;
			}
			var side = parseInt(elem.path.charAt(0));
			if (!game.matrix.isBlocked(side, elem.x, elem.y)) {
				game.matrix.move(elem.x, elem.y, side);
				elem.path = elem.path.substring(1);
			}
		});	
	}

	function isPathCycled(path) {
		var total = {n1:0, n2:0, n3:0, n4:0};
		for (var i = 0; i < path.length; i++) {
			total["n"+path.charAt(i)]++;
		}
		return total.n1==total.n2 && total.n3==total.n4;
	}

	game.spinArrows = function () {
		game.arrows.forEach (function(elem){
			if (elem.type.spin=="cw") {
				elem.box.angle += 90;
			} else if (elem.type.spin=="ccw") {
				elem.box.angle -= 90;
			}
			elem.box.dir = elem.dir = getDirFromAngle (elem.box.angle);
		});	

		game.blueBoxes.forEach(function(elem) {
			var x = elem.box.indexX;
			var y = elem.box.indexY;
			var aim = game.matrix[y][x];
			var prev = aim.prev;

			if (prev && prev.type.value==5) {
				game.matrix[y][x].box.frame = 1;
				if (!game.invert) {
					game.matrix[y][x].box.angle = o_getAngleFromDir(prev.box.dir);
				} else {
					game.matrix[y][x].box.angle = Puzzle.Game.getInvertedAngleFromDir(prev.box.dir);
				}
			} else {
				game.matrix[y][x].box.frame = 0;
			}
		});
	}
};

Puzzle.Game.prototype.update = function() {};

function step (key)
{
	if (game.moving || game.gameOverFlag) 
		return;
	game.updateDoors();
	if (key == game.keyUP) {
			if (game.invert)
				game.matrix.left();
			else
				game.matrix.up();
		}
		if (key == game.keyDOWN) {
			if (game.invert)
				game.matrix.right();
			else
				game.matrix.down();
		}
		if (key == game.keyLEFT) {
			if (game.invert)
				game.matrix.down();
			else
				game.matrix.left();
		}
		if (key == game.keyRIGHT) {
			if (game.invert)
				game.matrix.up();
			else
				game.matrix.right();
		}
	game.moveRobots();
	game.spinArrows();
}

Puzzle.Game.prototype.render = function() {
	//if (!game.device.desktop) return;
	//this.game.debug.text(this.time.fps, 2, 14, "#00ff00");
};

function opp(side) {
	switch (side) {
		case Phaser.LEFT:
			return Phaser.RIGHT;
		case Phaser.RIGHT:
			return Phaser.LEFT;
		case Phaser.UP:
			return Phaser.DOWN;
		case Phaser.DOWN:
			return Phaser.UP;
	}
}

function getDirFromAngle(angle) {
	switch (angle) {
		case 0:
			return Phaser.RIGHT;
		case 90:
			return Phaser.DOWN;
		case -180:
			return Phaser.LEFT;
		case -90:
			return Phaser.UP;
	}
}

function setBoxPosition (elem, params) {
	var toRemove = params.toRemove;
	var onSpikes = params.onSpikes;
	var x = elem.x;
	var y = elem.y;
	var xx,yy;
	if (!game.invert) {
		xx = Math.floor ((game.width - game.levelWidth*BSIZE)/2) + x*BSIZE + BSIZE/2;
		yy = Math.floor ((game.height - game.levelHeight*BSIZE)/2) + y*BSIZE + BSIZE/2;	
	} else {
		xx =  game.width - Math.floor ((game.width - game.levelHeight*BSIZE)/2) - y*BSIZE - BSIZE/2;
		yy =  Math.floor ((game.height - game.levelWidth*BSIZE)/2) + x*BSIZE + BSIZE/2;
	}
	if (params.port) {
		tween = game.add.tween(game.matrix[y][x].box).to( { alpha:0.3, width:0, height:0 }, 50, "Linear", true);
		tween.onComplete.add(function() {
			game.matrix[y][x].box.x = xx;
			game.matrix[y][x].box.y = yy;
			tween = game.add.tween(game.matrix[y][x].box).to( { alpha:1, width:BSIZE, height:BSIZE }, 50, "Linear", true);
		});
	} else {
		tween = game.add.tween(game.matrix[y][x].box).to( { x: xx, y: yy }, 100, "Linear", true);
	}
	tween.onComplete.add(function() {
		game.boxes.remove(toRemove);
		if (onSpikes) {
			if (isBlueBox(game.matrix[y][x].type)) {
				game.gameOverFlag = true;
				game.add.tween(game.matrix[y][x].box).to( { alpha:0 }, 200, "Linear", true, 0, 1, true).onComplete.add(finish);
			} else {
				game.matrix[y][x].box.type = 1;
				game.blueBoxes.splice(game.blueBoxes.indexOf(elem), 1);
			}
		} else {
			finish();
		}
		function finish () {
			game.moving = false;
			game.checkTeleport(x, y); 
			game.checkGameOver({onSpikes:onSpikes});
		}
	});
	game.moving = true;
}

function saveSolutionToFirebase() {
	return;
	var firebase = new Firebase("https://puzzle-lvl-editor-dev.firebaseio.com/levels-solutions").child(Number(Game.aimLVL)+1);
	var data = {};
	game.solution = game.solution.replace (new RegExp(Phaser.UP, 'g'), "u-");
	game.solution = game.solution.replace (new RegExp(Phaser.DOWN, 'g'), "d-");
	game.solution = game.solution.replace (new RegExp(Phaser.LEFT, 'g'), "l-");
	game.solution = game.solution.replace (new RegExp(Phaser.RIGHT, 'g'), "r-");
	data[game.solution] = new Date().toUTCString().slice(5, 25) + " =" + game.solution.length/2;
	firebase.update(data);
}

Puzzle.Game.rotateArrows = function() {
	game.arrows.forEach(function(elem){
		if (!game.invert) {
			elem.box.angle = o_getAngleFromDir(elem.box.dir);
		} else {
			elem.box.angle = Puzzle.Game.getInvertedAngleFromDir(elem.box.dir);
		}
	});
};

Puzzle.Game.getInvertedAngleFromDir = function (dir) {
	switch (dir) {
		case Phaser.RIGHT:
			return o_getAngleFromDir(Phaser.DOWN);
		case Phaser.DOWN:
			return o_getAngleFromDir(Phaser.LEFT);
		case Phaser.LEFT:
			return  o_getAngleFromDir(Phaser.UP);
		case Phaser.UP:
			return o_getAngleFromDir(Phaser.RIGHT);
		default :
			return 0;
	}
};