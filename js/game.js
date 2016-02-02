
var BSIZE = 50;
var Puzzle = Puzzle || {};
Puzzle.Game = function(){};
var game;


Puzzle.Game.prototype.preload = function () {
	this.time.advancedTiming = true;
	this.time.desiredFps = 30;
	this.game.renderer.renderSession.roundPixels = true;
	game = this.game;

	game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
	game.scale.setScreenSize(true);
	game.scale.setResizeCallback(onResized);
	game.scale.refresh();
};


function onResized (f) {
	if (f!=true && game.width==innerWidth && game.height==innerHeight) return;
	game.width = innerWidth;
	game.height = innerHeight;
	game.scale.setScreenSize(true);
	game.scale.refresh();
	BSIZE = Math.floor (Math.min(Math.max(game.width, game.height) / Math.max(game.levelWidth, game.levelHeight),
		Math.min(game.width, game.height) / Math.min(game.levelWidth, game.levelHeight)));
	if (game.boxes)
		game.boxes.forEach (resize);
	function resize (box) {
		box.scale.setTo (BSIZE/100, BSIZE/100);

		var xx = Math.floor ((window.innerWidth - game.levelWidth*BSIZE)/2) + box.indexX*BSIZE + BSIZE/2;
		var yy = Math.floor ((window.innerHeight - game.levelHeight*BSIZE)/2) + box.indexY*BSIZE + BSIZE/2;

		game.invert = (game.levelHeight > game.levelWidth) && (window.innerWidth > window.innerHeight) || (game.levelHeight < game.levelWidth) && (window.innerWidth < window.innerHeight);

		if (game.invert) {
			xx =  Math.floor ((window.innerWidth - game.levelHeight*BSIZE)/2) + box.indexY*BSIZE + BSIZE/2;
			yy =  Math.floor ((window.innerHeight - game.levelWidth*BSIZE)/2) + box.indexX*BSIZE + BSIZE/2;
		}

		box.x = xx;
		box.y = yy; 
	}
}

Puzzle.Game.prototype.create = function () {
	game.levelWidth = LEVELS[Editor.aimLVL][0].length;
	game.levelHeight = LEVELS[Editor.aimLVL].length;
	game.levelArr = LEVELS[Editor.aimLVL];
	BSIZE = Math.floor (Math.min(Math.max(game.width, game.height) / Math.max(game.levelWidth, game.levelHeight),
		Math.min(game.width, game.height) / Math.min(game.levelWidth, game.levelHeight)));

	game.invert = (game.levelHeight > game.levelWidth) && (window.innerWidth > window.innerHeight) || (game.levelHeight < game.levelWidth) && (window.innerWidth < window.innerHeight);
	Puzzle.Game.prototype.createStage();
	onResized(true);

	this.addMenu();
};

Puzzle.Game.prototype.addMenu = function () {
	var editor_label = game.add.text(0 , 20, 'Editor', { font: '24px Arial', fill: '#0' });
	editor_label.inputEnabled = true;
	editor_label.events.onInputDown.add(function () {
		this.game.state.start('Editor');
	});
}


Puzzle.Game.prototype.createStage = function () {
	game.moving = false;
	game.world.setBounds(0, 0, 2880, 2880);
	//var tile = game.add.tileSprite(0, 0, game.width, game.height, 'box_space');
	//tile.tileScale.set(BSIZE/100, BSIZE/100);
	game.boxes = game.add.group();

	game.keyUP = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	game.keyDOWN = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	game.keyLEFT = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	game.keyRIGHT = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	game.keyUP.onDown.add(step, this);
	game.keyDOWN.onDown.add(step, this);
	game.keyLEFT.onDown.add(step, this);
	game.keyRIGHT.onDown.add(step, this);

	game.matrix = [];
	game.blueBoxes = [];
	game.doors = [];
	game.ports = [];
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
				//if(arr[y][x]==0) box = game.boxes.create (xx, yy, 'box_space');
				if(arr[y][x]==1) box = game.boxes.create (xx, yy, 'box_black');
				if(arr[y][x]==2) box = game.boxes.create (xx, yy, 'box_blue');
				if(arr[y][x]==3) box = game.boxes.create (xx, yy, 'box_gap');
				box.angle = (Math.round(Math.random()*3))*90;
				if (arr[y][x] instanceof Object) {
					if (arr[y][x].value == 4) {
						box = game.boxes.create(xx, yy, 'box_door');
						box.frame = arr[y][x].state;
					}
					if (arr[y][x].value == 5) {
						box = game.boxes.create(xx, yy, 'box_arr');
						box.angle = o_getAngleFromDir(arr[y][x].dir);
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
				if (box.key=="box_blue") 
					game.blueBoxes.push (game.matrix[y][x]);
				else if (box.key=="box_door")
					game.doors.push (game.matrix[y][x]);
				else if (box.key=="box_port")
					game.ports.push (game.matrix[y][x]);
			}
		}
	}
	game.inputEnabled = true;
	game.input.onDown.add(beginSwipe, this);

	game.matrix.move=function(x, y, side) {
		var temp = game.matrix[y][x];
		game.matrix.del(x, y);
		switch (side) {
			case "left":
				--x;
			break;
			case "right":
				++x;
			break;
			case "up":
				--y;
			break;
			case "down":
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
		setBoxPosition(game.matrix[y][x]);
	};

	game.matrix.next = function (side, x, y, line) {
		if (x == undefined) {
			switch (side) {
				case "left":
					x = game.matrix[0].length-1;
					y = 0;
				break;
				case "right":
					x = 0;
					y = 0;
				break;
				case "up":
					x = 0;
					y = game.matrix.length-1;
				break;
				case "down":
					x = 0;
					y = 0;
				break;
			}
		}
		switch (side) {
			case "left":
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
			case "right":
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
			case "up":
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
			case "down":
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
				(elem.type.value==5 && game.canGoOnDirection(elem.box.angle, side)) ||
				 elem.type.value==6) {
				break;
			}
			isBlocked = true;
			break;
		}
		if (game.matrix[y][x] && game.matrix[y][x].prev && game.matrix[y][x].prev.type)
			if (game.matrix[y][x].prev.type.value==5 && !game.canGoFromDirection(game.matrix[y][x].prev.box.angle, side))
				isBlocked = true;
			
		return isBlocked;
	}

	game.matrix.moveAll=function(side){
		game.blueBoxes.sort(game.matrix.sortFunction(side));
		var deleted = false;
		for (var i = 0; i < game.blueBoxes.length; ++i) {
			var cur = game.blueBoxes[i];
			var next = this.next(side, cur.x, cur.y);
			if (!this.isBlocked(side, cur.x, cur.y)) {
				this.move(cur.x, cur.y, side);
				if (next && next.type==3)
					game.gameOverFlag = true;
			} else {
				if (next && next.type==2) {
					if (this.isBlocked(side, next.x, next.y)) {				
						game.blueBoxes[game.blueBoxes.indexOf(next)]="deleted";
						game.matrix.del(next.x, next.y);
						game.boxes.remove(next.box);
						this.move(cur.x, cur.y, side);
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
			case "left":
				return game.matrix.sortFunctionLeft;
			case "right":
				return game.matrix.sortFunctionRight;
			case "up":
				return game.matrix.sortFunctionUp;
			case "down":
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
		this.moveAll("left");
	};

	game.matrix.right=function(){
		this.moveAll("right");
	};

	game.matrix.up=function(){
		this.moveAll("up");
	};

	game.matrix.down=function(){
		this.moveAll("down");
	};

	game.checkGameOver = function () {
		if (game.gameOverFlag) {
			Puzzle.game.state.start('Boot');
			game.gameOverFlag = false;
		}
	}

	game.updateDoors = function () {
		game.doors.forEach(function(box){
			box.box.frame=(box.box.frame+1)%2;
		});
	}

	game.canGoFromDirection = function (angle, dir) {
		if (getDirFromAngle (angle)==dir)
			return true;
		return false;
	}

	game.canGoOnDirection = function (angle, dir) {
		if (opp(getDirFromAngle (angle))==dir)
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
					setBoxPosition (game.matrix[elem.y][elem.x]);
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
	//game.matrix.down();
	//game.matrix.up();
	//game.matrix.right();
	//game.matrix.left();
	//console.log();
};

Puzzle.Game.prototype.update = function() {};

function step (key)
{
	if (game.moving) 
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
				game.matrix.up();
			else
				game.matrix.left();
		}
		if (key == game.keyRIGHT) {
			if (game.invert)
				game.matrix.down();
			else
				game.matrix.right();
		}
		return;
}

Puzzle.Game.prototype.render = function() {
	this.game.debug.text(this.time.fps || '--', 2, 14, "#00ff00");
};

function opp(side) {
	switch (side) {
		case "left":
			return "right";
		case "right":
			return "left";
		case "up":
			return "down";
		case "down":
			return "up";
	}
}

function getDirFromAngle(angle) {
	switch (angle) {
		case 0:
			return "right";
		case 90:
			return "down";
		case -180:
			return "left";
		case -90:
			return "up";
	}
}

function setBoxPosition (elem) {
	var x = elem.x;
	var y = elem.y;
	var xx,yy;
	if (!game.invert) {
		xx = Math.floor ((window.innerWidth - game.levelWidth*BSIZE)/2) + x*BSIZE + BSIZE/2;
		yy = Math.floor ((window.innerHeight - game.levelHeight*BSIZE)/2) + y*BSIZE + BSIZE/2;	
	} else {
		xx =  Math.floor ((window.innerWidth - game.levelHeight*BSIZE)/2) + y*BSIZE + BSIZE/2;
		yy =  Math.floor ((window.innerHeight - game.levelWidth*BSIZE)/2) + x*BSIZE + BSIZE/2;
	}
	var qwe = game.matrix[y][x].box;
	tween = game.add.tween(game.matrix[y][x].box).to( { x: xx, y: yy }, 100, "Linear", true);
	tween.onComplete.add(function() { game.moving = false; game.checkTeleport(x, y); game.checkGameOver(); });
	game.moving = true;
}
